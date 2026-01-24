import React, { useState } from 'react';
import { ingestSong } from '../api';
import { useNavigate } from 'react-router-dom';

function Ingest() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('artist', artist);

        try {
            await ingestSong(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || "Upload failed");
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Ingest New Song</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Song Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Enter title..." />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Artist</label>
                    <input type="text" value={artist} onChange={e => setArtist(e.target.value)} placeholder="Enter artist..." />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Audio File (MP3/WAV)</label>
                    <input type="file" onChange={e => setFile(e.target.files[0])} accept="audio/*" required />
                </div>

                {error && <div className="status-error" style={{ marginBottom: '1rem' }}>{error}</div>}

                <button className="btn" disabled={loading} style={{ width: '100%' }}>
                    {loading ? <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div> : "Upload & Analyze"}
                </button>
            </form>
        </div>
    );
}

export default Ingest;
