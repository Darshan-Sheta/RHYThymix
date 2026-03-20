# 🎵 RHYThymix – AI-Powered Music Recognition & Recommendation Engine

**Tagline:** Shazam meets AI-Curated Playlists

RHYThymix is a full-stack AI-powered music analysis system that can identify songs from short audio clips and recommend similar music based on audio characteristics. Instead of relying only on metadata like artist or genre, the system analyzes the actual sound of music using signal processing and machine learning.

---

## 🚀 Features

### 🎧 Audio Fingerprinting (Song Identification)
- Identify songs from 5–10 second audio recordings
- Uses audio fingerprinting to match exact sound patterns
- Works even with noisy recordings

### 🤖 AI-Based Music Recommendations
- Analyzes timbre, rhythm, and pitch of songs
- Suggests tracks that sound similar even across different genres

### 📂 Bulk Audio Ingestion
- Upload entire folders of MP3 files
- Automatically extracts audio fingerprints and features
- Builds a searchable music database

---

## 🧠 How the System Works

### 1. Audio Ingestion
User uploads an audio file.

System extracts:
- Fingerprint → for exact song identification  
- Audio Features → for recommendation engine

### 2. Feature Extraction
Using Librosa:
- Spectral Centroid
- Zero Crossing Rate
- MFCC (Mel-Frequency Cepstral Coefficients)

### 3. Storage
Processed data is stored in a SQLite database.

### 4. Machine Learning Processing
Songs are converted into feature vectors and clustered using ML.

### 5. Song Identification
User records audio → system compares fingerprint → returns matched song.

---

## 🧩 System Architecture

User Audio Input  
↓  
Feature Extraction (Librosa)  
↓  
Audio Fingerprint (Chromaprint) + Audio Features (MFCC, Spectral, ZCR)  
↓  
Database Storage (SQLite)  
↓  
Machine Learning Model (K-Means)  
↓  
Song Identification & Recommendation  

---

## ⚙️ Tech Stack

### Frontend
- React.js (Vite)
- CSS Glassmorphism UI

### Backend
- FastAPI (Python)
- SQLite Database

### Core Libraries
- Librosa – Audio signal processing
- Chromaprint – Audio fingerprinting
- Scikit-Learn – Machine learning algorithms

---

## 🧮 Algorithms Used

### 1. Audio Fingerprinting
Algorithm: Chromaprint  

Converts audio into a unique fingerprint hash.  
If fingerprint similarity > 90%, the system identifies the same song.

### 2. Feature Extraction
Algorithm: Fast Fourier Transform (FFT)

Breaks audio waves into frequency components to extract:
- Spectral Centroid (Brightness)
- Zero Crossing Rate (Percussion)
- MFCC (Sound texture)

### 3. Recommendation Engine
Algorithm: K-Means Clustering

- Each song becomes a vector in multi-dimensional space
- Similar songs cluster together
- Recommendations use Euclidean distance to find nearest neighbors

---

## 🧠 AI / Machine Learning Model

Learning Type: Unsupervised Learning  

Because music doesn't have predefined labels like happy, sad, or energetic, the model organizes songs automatically.

Features used for clustering:
- Spectral Centroid
- Zero Crossing Rate
- MFCC

Result: Songs with similar sound patterns fall into the same cluster.

---

## ⚡ Challenges & Solutions

### Large File Uploads
Problem: Handling multiple MP3 uploads  

Solution:
- Built Batch Ingestion Pipeline
- Added error handling and timeout management

### Low Model Accuracy
Problem: Small dataset  

Solution:
- Implemented Pickle Model Persistence
- Model improves incrementally as more songs are added

### Frontend Integration
Problem: API communication issues  

Solution:
- Fixed CORS configuration
- Implemented proper Multipart Form Data handling

---

## 🔮 Future Improvements

- PostgreSQL + pgvector for large-scale music datasets
- Deep Learning (CNN) for deeper audio understanding
- Cloud deployment using AWS + S3 storage
- Real-time streaming recognition
- User playlist personalization

---

## 📌 Conclusion

RHYThymix demonstrates how signal processing, machine learning, and modern web development can be combined to build an intelligent music analysis system.

Instead of organizing music using text metadata, RHYThymix organizes music by actual sound characteristics, enabling smarter identification and recommendations.

---

⭐ If you like this project, consider starring the repository.
