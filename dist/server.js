"use strict";
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});
io.on('connection', (socket) => {
    console.log('a user connected :', socket.id);
    socket.on('disconnect', () => {
        console.log('a user disconnected :', socket.id);
    });
});
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});
