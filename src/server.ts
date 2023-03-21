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

    socket.on('disconnect', () => {
        console.log('a user disconnected :',socket.id);
    });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});