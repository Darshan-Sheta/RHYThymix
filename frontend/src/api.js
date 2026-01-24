import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_URL,
});

export const getSongs = async () => {
    const response = await api.get('/songs');
    return response.data;
};

export const ingestSong = async (formData) => {
    const response = await api.post('/songs/ingest', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const identifySong = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'recording.wav');

    const response = await api.post('/songs/identify', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
