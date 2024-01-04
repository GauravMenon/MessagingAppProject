import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Channel.css';
const server = 'http://localhost:8080/api'

function Channel() {
    const { id } = useParams();
    const [messages, setMessages] = React.useState([]);
    const [newMessageText, setNewMessageText] = React.useState('');

    const createMessage = () => {
        axios
            .post(`${server}/messages`, { text: newMessageText, userId: 1, channelId: id })
            .then(() => {
                setNewMessageText('');
                fetchMessages();
            });
    };

    const fetchMessages = () => {
        axios.get(`${server}/messages/${id}`).then((response) => {
            setMessages(response.data);
        });
    };

    React.useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <div>
            <h2>Channel {id}</h2>
            <ul>
                {messages.map((message) => (
                    <li key={message.id}>
                        {message.text}
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
                    />
                </label>
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Channel;