import React from 'react';
import axios from 'axios';

import './Channels.css';

function ChannelBackUP() {
    const { id } = useParams();
    const [messages, setMessages] = React.useState([]);
    const [newMessageText, setNewMessageText] = React.useState('');

    const createMessage = () => {
        axios
            .post('/api/messages', { text: newMessageText, userId: 1, channelId: id })
            .then(() => {
                setNewMessageText('');
                fetchMessages();
            });
    };

    const fetchMessages = () => {
        axios.get(`/api/messages?channelId=${id}`).then((response) => {
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
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                axios
                                    .post('/api/replies', {
                                        text: e.target.elements.text.value,
                                        userId: 1,
                                        channelId: id,
                                        parentMessageId: message.id,
                                    })
                                    .then(() => {
                                        e.target.elements.text.value = '';
                                        fetchMessages();
                                    });
                            }}
                        >
                            <input type="text" name="text" placeholder="Reply" />
                            <button type="submit">Send</button>
                        </form>
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