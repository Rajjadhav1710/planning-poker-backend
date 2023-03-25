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
    socket.on('join-room', (roomId, newUser, callBack) => {
        let roomIndex = allRoomDataService.getRoomIndex(roomId);
        if (roomIndex === -1) {
            console.log("Room not found");
        }
        else {
            // connect socket
            socket.join(roomId);
            // add user to room ( on server )
            allRoomDataService.joinRoom(roomId, newUser);
            // return room object to the user which newly connected ( unicast )
            let joinedRoom = allRoomDataService.getRoomByRoomIndex(roomIndex);
            socket.emit('room-details', joinedRoom);
            // new user event ( broadcast to room except the new user )
            socket.broadcast.to(roomId).emit('new-user', newUser);
        }
        // callBack();
    });
    socket.on('give-vote', (voteDetails) => {
        //update user of server's room instance
        allRoomDataService.updateRoomUserVote(voteDetails);
        //update user of client's room instance (broadcast to a room)
        io.to(voteDetails.roomId).emit('receive-vote', voteDetails);
    });
    socket.on('revoke-vote', (voteDetails) => {
        //update user of server's room instance
        allRoomDataService.updateRoomUserVote(voteDetails);
        //update user of client's room instance (broadcast to a room)
        io.to(voteDetails.roomId).emit('revoke-vote', voteDetails);
    });
    socket.on('reveal-cards', (roomId) => {
        //update server's room instance
        allRoomDataService.revealRoomCards(roomId);
        //update client's room instance (broadcast to a room)
        io.to(roomId).emit('reveal-cards');
    });
    socket.on('start-new-voting', (roomId) => {
        //update server's room instance
        // TODO: reset room state
        //update client's room instance (broadcast to a room)
        io.to(roomId).emit('start-new-voting');
    });
    socket.on('disconnect', () => {
        console.log('a user disconnected :', socket.id);
    });
});
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});
