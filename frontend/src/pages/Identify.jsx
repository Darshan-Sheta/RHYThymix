import React, { useState, useRef } from 'react';
import { identifySong } from '../api';

function Identify() {
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        setResult(null);
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
                setAudioBlob(blob);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setRecording(true);
        } catch (err) {
            setError("Microphone access denied or not available.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
            // Stop tracks to release mic
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudioBlob(file);
            setResult(null);
            setError(null);
        }
    };

    const handleIdentify = async () => {
        if (!audioBlob) return;
        setLoading(true);
        setError(null);
        try {
            const data = await identifySong(audioBlob);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.detail || "Identification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2>Identify Song</h2>
                <div style={{ marginBottom: '2rem' }}>
                    {!recording ? (
                        <button className="btn" onClick={startRecording} style={{ background: '#ef4444', marginRight: '10px' }}>
                            🎤 Start Recording
                        </button>
                    ) : (
                        <button className="btn" onClick={stopRecording} style={{ background: '#64748b' }}>
                            ⏹ Stop Recording
                        </button>
                    )}
                </div>

                <p>OR</p>
                <div style={{ maxWidth: '300px', margin: '1rem auto' }}>
                    <input type="file" onChange={handleFileUpload} accept="audio/*" />
                </div>

                {audioBlob && (
                    <div style={{ marginTop: '1rem' }}>
                        <p>Audio captured!</p>
                        <button className="btn" onClick={handleIdentify} disabled={loading}>
                            {loading ? "Analyzing..." : "🔍 Identify Now"}
                        </button>
                    </div>
                )}

                {error && <div className="status-error" style={{ marginTop: '1rem' }}>{error}</div>}
            </div>

            {result && (
                <div className="glass-panel animate-fade-in">
                    <h2 style={{ color: '#4ade80' }}>Match Found!</h2>
                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <h3>{result.song.title}</h3>
                            <p className="text-xl" style={{ fontSize: '1.2rem', color: '#94a3b8' }}>{result.song.artist}</p>
                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem' }}>
                                <p><strong>Confidence:</strong> {result.confidence}</p>
                                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>"{result.explanation}"</p>
                            </div>
                        </div>

                        <div>
                            <h4>Recommended Similar Songs</h4>
                            {result.recommendations.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {result.recommendations.map(rec => (
                                        <li key={rec.id} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <strong>{rec.title}</strong> - {rec.artist}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No recommendations available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Identify;
