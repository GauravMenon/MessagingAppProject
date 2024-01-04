import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Channels from './Channels';
import '../App.css';

const server = 'http://localhost:8080/api'

function App() {
    const [messages, setMessages] = useState([]);
    const [newMessageText, setNewMessageText] = useState('');

    const fetchMessages = (channelId) => {
        axios.get(`${server}/api/channels/${channelId}/messages`)
            .then((response) => {
                setMessages(response.data);
            })
            .catch((error) => {
                console.error(error)
            })
    };

    const createMessage = () => {
        const channelId = window.location.pathname.split('/').pop();
        const messageText = document.querySelector('input[name="text"]').value;
        axios
            .post(`${server}/channels/${channelId}/messages`, { text: messageText, userId: 1 })
            .then(() => {
                fetchMessages(channelId);
                document.querySelector('input[name="text"]').value = '';
            })
            .catch((error) => {
                console.error(error);
            })
    };

    const createReply = (messageId) => {
        const channelId = window.location.pathname.split('/').pop();
        const replyText = document.querySelector(`input[name="${messageId}"]`).value;
        axios
            .post(`${server}/channels/${channelId}/messages/${messageId}/replies`, {
                text: replyText,
                userId: 1,
            })
            .then(() => {
                fetchMessages(channelId);
                document.querySelector(`input[name="${messageId}"]`).value = '';
            })
            .catch((error) => {
                console.error(error);
            })
    };

    useEffect(() => {
        const channelId = window.location.pathname.split('/').pop();
        fetchMessages(channelId);
    }, []);

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/channels">Channels</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<div><h1>Welcome to the chat app!</h1><p>Select a channel to start chatting.</p></div>} />
                    <Route path="/channels" element={<Channels />} />
                    <Route
                        path="/channels/:channelId"
                        element={
                            <div>
                                <h2>Messages</h2>
                                <ul>
                                    {messages.map((message) => (
                                        <li key={message.id}>
                                            <div>{message.text}</div>
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    createReply(message.id);
                                                }}
                                            >
                                                <input type="text" name={message.id} placeholder="Reply" />
                                                <button type="submit">Send</button>
                                            </form>
                                            <ul>
                                                {message.replies.map((reply) => (
                                                    <li key={reply.id}>{reply.text}</li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        createMessage();
                                    }}
                                >
                                    <label>
                                        New message:
                                        <input
                                            type="text"
                                            value={newMessageText}
                                            onChange={(e) => setNewMessageText(e.target.value)}
                                            name="text"
                                        />
                                    </label>
                                    <button type="submit">Send</button>
                                </form>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
