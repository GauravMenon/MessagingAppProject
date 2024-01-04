import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom';
import Home from './Home';
import ChannelList from './ChannelList';
import Channel from './Channel';
import Login from './Login';
import Signup from './Signup';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div>
                {isLoggedIn ? (
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/channels">Channels</Link>
                            </li>
                            <li>
                                <Link to="/login" onClick={handleLogout}>Logout</Link>
                            </li>
                        </ul>
                    </nav>
                ) : null}
                <div className="container">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
                            }
                        />
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/channels" element={<ChannelList />} />
                        <Route path="/channels/:id" element={<Channel />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
