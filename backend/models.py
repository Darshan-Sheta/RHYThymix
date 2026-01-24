from pydantic import BaseModel
from typing import Optional, List

class SongBase(BaseModel):
    title: str
    artist: Optional[str] = "Unknown"

class SongCreate(SongBase):
    pass

class Song(SongBase):
    id: int
    duration: float
    filepath: str

    class Config:
        from_attributes = True

class MatchResult(BaseModel):
    song: Song
    score: float
    confidence: str
    explanation: str
    recommendations: List[Song]
