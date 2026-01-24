import React, { useEffect, useState } from 'react';
import { getSongs } from '../api';
import { Link } from 'react-router-dom';

function Home() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSongs();
    }, []);

    const loadSongs = async () => {
        try {
            const data = await getSongs();
            setSongs(data);
        } catch (err) {
            setError("Failed to load songs. Is backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Music Library</h2>
                <Link to="/ingest" className="btn" style={{ textDecoration: 'none' }}>+ Add Song</Link>
            </div>

            {loading && <div className="loading-spinner"></div>}
            {error && <div className="status-error">{error}</div>}

            {!loading && songs.length === 0 && <p>No songs in database yet.</p>}

            <div className="grid">
                {songs.map(song => (
                    <div key={song.id} className="card">
                        <h3>{song.title}</h3>
                        <p style={{ color: '#94a3b8' }}>{song.artist}</p>
                        <p style={{ fontSize: '0.8rem' }}>Duration: {song.duration.toFixed(1)}s</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
