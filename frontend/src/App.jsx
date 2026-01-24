import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Ingest from './pages/Ingest';
import Identify from './pages/Identify';

function App() {
    return (
        <Router>
            <nav className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <Link to="/" className="nav-link">Library</Link>
                <Link to="/identify" className="nav-link">Identify</Link>
                <Link to="/ingest" className="nav-link">Ingest</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ingest" element={<Ingest />} />
                <Route path="/identify" element={<Identify />} />
            </Routes>
        </Router>
    );
}

export default App;
