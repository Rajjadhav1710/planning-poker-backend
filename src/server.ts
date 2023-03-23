import { Room } from "./Models/room.model";
import { User } from "./Models/user.model";
import { AllRoomDataService } from "./Services/all-room-data.service";

const express = require('express');
const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http,{
    cors: {
        origin: '*'
    }
});

app.get('/',(req: any, res: any)=>{
    res.send('<h1>Hello World!</h1>');
});

const allRoomDataService = new AllRoomDataService();

io.on('connection', (socket: any) => {
    console.log('a user connected :',socket.id);

    socket.on('create-room',( roomDetails : { 
        roomId: string, 
        roomName: string, 
        votingSystem: string 
      }, callBack : any )=>{
        console.log("on event : create-room","\nData : ", roomDetails);

        // create new room through AllRoomDataService
        allRoomDataService.createRoom(roomDetails);

        callBack();
    });

    socket.on('join-room',( roomId: string, newUser: User, callBack: any )=>{

        let roomIndex: number = allRoomDataService.getRoomIndex(roomId);

        if(roomIndex === -1){
            console.log("Room not found");
        }else{
            // connect socket
            socket.join(roomId);

            // add user to room ( on server )
            allRoomDataService.joinRoom(roomId, newUser);

            // return room object to the user which newly connected ( unicast )
            let joinedRoom: Room = allRoomDataService.getRoomByRoomIndex(roomIndex);
            socket.emit('room-details', joinedRoom);
            
            // new user event ( broadcast except the new user )
            socket.broadcast.to(roomId).emit('new-user', newUser);
        }

        // callBack();
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected :',socket.id);
    });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});