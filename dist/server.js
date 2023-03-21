"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const all_room_data_service_1 = require("./Services/all-room-data.service");
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
const allRoomDataService = new all_room_data_service_1.AllRoomDataService();
io.on('connection', (socket) => {
    console.log('a user connected :', socket.id);
    socket.on('create-room', (roomDetails, callBack) => {
        console.log("on event : create-room", "\nData : ", roomDetails);
        // create new room through AllRoomDataService
        allRoomDataService.createRoom(roomDetails);
        callBack();
    });
    socket.on('disconnect', () => {
        console.log('a user disconnected :', socket.id);
    });
});
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});
