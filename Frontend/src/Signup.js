import React, { useState } from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import './Signup.css'

function Signup() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [signupError, setSignupError] = useState(false);


    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .post('http://localhost:8080/api/signup', {
            name: name,
            password: password,
            email: email
            })
            .then(function (response) {
                console.log(response);
                setSignupSuccess(true);
                setSignupError(false);
            })
            .catch(function (error) {
                console.log(error.response.data);
                setSignupSuccess(false);
                setSignupError(true);
            });
    };

    return (
        <div>
            <h2>Signup here!</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <br />
                <button type="submit">Sign up</button>
                <br />
                {signupSuccess && <p>Signup successful!</p> && <Link to ='/login'> Click here to go back to the login screen</Link>}
                {signupError && <p>Error during signup.</p>}
            </form>
        </div>
    );
}



export default Signup;
