'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());

var connection = mysql.createConnection({
    host: 'dbsql',
    user: 'root',
    password: 'admin'
});

connection.connect();

//Default page for server
app.get('/', (req, res) => {
    res.send('Hello and welcome to the server! To initalize the database, put /init at the end of the url and to restart with a fresh database use /destroy then replace that with /init at the end of the URL')
})

//Initializes the database
app.get('/init', (req,res) => {
    connection.query(`CREATE DATABASE IF NOT EXISTS projectDB`, function (err){
        if (err) {
            console.log(err);
        }
        console.log("Database projectDB has been Created!")
    });

    connection.query(`USE projectDB`, function (err){
        if (err) {
            console.log(err);
        }
        console.log("Using projectDB")
    })

    connection.query(`CREATE TABLE IF NOT EXISTS channels (
        id int AUTO_INCREMENT PRIMARY KEY,
        name varchar(255) NOT NULL)`,
        function (err){
            if (err){
                console.log(err)
            } else {
                console.log('Created the table channels')
            }
    })

    connection.query(`CREATE TABLE IF NOT EXISTS messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          text VARCHAR(255) NOT NULL,
          user_id INT NOT NULL,
          channel_id INT NOT NULL,
          parent_message_id INT,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (channel_id) REFERENCES channels(id),
          FOREIGN KEY (parent_message_id) REFERENCES messages(id) )`, function (err){
        if (err){
            console.log(err)
        } else {
            console.log("messages table has been created")
        }
    })

    connection.query(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL )`, function (err){
        if (err){
            console.log(err)
        } else {
            console.log("users table has been created")
        }
    })
})

//Drops the database for fresh new one to be made
app.get('/destroy', (res,req) => {
    connection.query(`DROP DATABASE projectDB`, function (err){
        if (err){
            console.log(err);
        } else {
            console.log("Successfully dropped the database projectDB")
        }
    })
})

//Signup
app.post('/api/signup', (req, res) => {
    const { name, password, email } = req.body;

    // Validate input
    if (!name || !password || !email) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user already exists
    const checkUserExists = `SELECT * FROM users WHERE email = '${email}'`;
    connection.query(checkUserExists, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500)
        }

        if (results.length > 0) {
            return res.status(409)
        }

        // Insert user into database
        const insertUser = `INSERT INTO users (name, password, email) VALUES ('${name}', '${password}', '${email}')`;
        connection.query(insertUser, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500)
            }
            return res.status(201)
        });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    connection.query(
        `SELECT * FROM users WHERE email = ? AND password = ?`,
        [email, password],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            } else if (results.length === 0) {
                res.status(401).json({ message: 'Invalid email or password' });
            } else {
                const user = results[0];
                res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email
                });
            }
        }
    );
});

//Get channels
app.get('/api/channels', (req, res) => {
    const queryString = "SELECT * FROM channels";
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for channels: " + err);
            res.sendStatus(500);
            return;
        }
        res.json(rows);
    });
});

//Create channel
app.post('/api/channels', (req, res) => {
    const name = req.body.name;
    if (!name) {
        res.sendStatus(400).json({ message: 'The name of the channel cannot be empty'});
        return
    }
    const queryString = "INSERT INTO channels (name) VALUES (?)";
    connection.query(queryString, [name], (err, results, fields) => {
        if (err) {
            console.log("Failed to insert new channel: " + err);
            res.sendStatus(500);
            return;
        }
        console.log("Inserted a new channel with id: ", results.insertId);
        res.sendStatus(201);
    });
});

//Create message
app.post('/api/messages', (req, res) => {
    const text = req.body.text;
    const userId = req.body.userId;
    const channelId = req.body.channelId;
    const parentMessageId = req.body.parentMessageId || null;
    if (!text) {
        res.sendStatus(400).json({message: 'The contents of the message cannot be empty'});
    }
    const sql = 'INSERT INTO messages (text, user_id, channel_id, parent_message_id) VALUES (?, ?, ?, ?)';
    connection.query(sql, [text, userId, channelId, parentMessageId], (err, result) => {
        if (err) throw err;
        res.send('Message created');
    });
});

//Get message in that specific channel
app.get('/api/messages/:channelId', (req, res) => {
    const channelId = req.params.channelId;
    const sql = 'SELECT * FROM messages WHERE channel_id = ?';
    connection.query(sql, [channelId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});



app.post('/api/replies', (req, res) => {
    const text = req.body.text;
    const userId = req.body.userId;
    const channelId = req.body.channelId;
    const parentMessageId = req.body.parentMessageId;
    const sql = 'INSERT INTO messages (text, user_id, channel_id, parent_message_id) VALUES (?, ?, ?, ?)';
    connection.query(sql, [text, userId, channelId, parentMessageId], (err, result) => {
        if (err) throw err;
        res.send('Reply created');
        console.log('Reply created')
    });
});

app.listen(PORT, HOST);
console.log('Up and running on port: ' + PORT)