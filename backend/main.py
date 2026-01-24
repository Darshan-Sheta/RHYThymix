from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import shutil
import os
import json
import random
from typing import List

from db import engine, get_db, init_db, SongDB
from models import Song, SongCreate, MatchResult
import chromaprint_utils
import fingerprint_matcher

app = FastAPI(title="Music AI Recognizer")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.on_event("startup")
def on_startup():
    init_db()

@app.post("/songs/ingest", response_model=Song)
async def ingest_song(
    file: UploadFile = File(...),
    title: str = Form(...),
    artist: str = Form("Unknown"),
    db: Session = Depends(get_db)
):
    try:
        # Save file
        file_ext = os.path.splitext(file.filename)[1]
        file_path = os.path.join(UPLOAD_DIR, f"{title.replace(' ', '_')}_{random.randint(1000,9999)}{file_ext}")
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Generate fingerprint
        # Note: fpcalc might fail if format is not supported. 
        # For simplicity, we assume robust fpcalc or user uploads standard audio.
        # If needed, convert first.
        
        try:
           duration, fingerprint = chromaprint_utils.generate_fingerprint(file_path)
        except Exception as e:
            # Cleanup
            os.remove(file_path)
            raise HTTPException(status_code=400, detail=f" fingerprinting failed: {str(e)}")

        # Store in DB
        db_song = SongDB(
            title=title,
            artist=artist,
            filepath=file_path,
            duration=duration,
            fingerprint=json.dumps(fingerprint) # Store list as JSON string
        )
        db.add(db_song)
        db.commit()
        db.refresh(db_song)
        
        return db_song
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/songs/identify", response_model=MatchResult)
async def identify_song(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    temp_path = f"temp_{random.randint(1000,9999)}.wav"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Generate fingerprint for clip
        duration, clip_fp = chromaprint_utils.generate_fingerprint(temp_path)
        
        if not clip_fp:
             raise HTTPException(status_code=400, detail="Could not generate fingerprint from audio clip")

        # Fetch all songs (Naive approach: loading all refs into memory. Ok for small project)
        songs = db.query(SongDB).all()
        
        best_song = None
        best_score = 0.0
        
        for song in songs:
            song_fp = json.loads(song.fingerprint)
            sim, conf = fingerprint_matcher.calculate_similarity(clip_fp, song_fp)
            
            if sim > best_score:
                best_score = sim
                best_song = song
        
        if not best_song or best_score < 0.4: # Threshold
             raise HTTPException(status_code=404, detail="No match found")
             
        # Recommendations
        # 1. By Artist
        recommendations = db.query(SongDB).filter(
            SongDB.artist == best_song.artist, 
            SongDB.id != best_song.id
        ).all()
        
        # 2. Fallback: Random
        if not recommendations:
            all_others = db.query(SongDB).filter(SongDB.id != best_song.id).all()
            recommendations = random.sample(all_others, min(len(all_others), 3))
            
        return MatchResult(
            song=best_song,
            score=best_score,
            confidence=f"{int(best_score*100)}%",
            explanation=fingerprint_matcher.explain_match(best_score),
            recommendations=recommendations
        )

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/songs", response_model=List[Song])
def list_songs(db: Session = Depends(get_db)):
    return db.query(SongDB).all()

@app.get("/songs/{song_id}", response_model=Song)
def get_song(song_id: int, db: Session = Depends(get_db)):
    song = db.query(SongDB).filter(SongDB.id == song_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song
