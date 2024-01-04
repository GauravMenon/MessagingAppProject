import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css'

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .post('http://localhost:8080/api/login', {
                email: email,
                password: password
            })
            .then(function (response) {
                console.log(response.data);
                onLogin(true);
                navigate('/home');
            })
            .catch(function (error) {
                console.log(error.response.data);
                setLoginError(true);
            });
    };

    return (
        <div>
            <h2>Login page!</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Login</button>
                <br />
                {loginError && <p>Invalid email or password.</p>}
            </form>
                <br />
                <Link to="/signup">Don't have an account? Sign up here.</Link>
        </div>
    );
}

export default Login
