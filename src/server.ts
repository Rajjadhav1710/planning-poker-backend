import { Room } from "./Models/room.model";
import { User } from "./Models/user.model";
import { AllRoomDataService } from "./Services/all-room-data.service";

require("dotenv").config();

const path = require("path");

const express = require('express');
const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http,{
    cors: {
        origin: '*'
    }
});

//CORS Setup
const cors = require('cors');
const corsOptions = {
    origin : process.env.ALLOWED_CLIENTS?.split(',')
    // origin will be an array : ['http://localhost:3000','http://localhost:5000']
};

//Middleware Setup
app.use(express.json());// to parse JSON post bodies
app.use(cors(corsOptions));

//Routes
app.use("/api/email",require(path.join(__dirname,"Routes","email")));


app.get('/',(req: any, res: any)=>{
    res.send('<h1>Hello World!</h1>');
});

const allRoomDataService = new AllRoomDataService();

io.on('connection', (socket: any) => {
    console.log('a user connected with socket id :',socket.id);

    socket.on('create-room',( roomDetails : { 
        roomId: string, 
        roomName: string, 
        votingSystem: string 
      }, callBack : any )=>{
        console.log("on event : create-room","\nroomDetails : ", roomDetails);

        // create new room through AllRoomDataService
        allRoomDataService.createRoom(roomDetails);

        callBack();
    });

    socket.on('join-room',( roomId: string, newUser: User, callBack: any )=>{
        console.log("on event : join-room","\nData : \nroomId : ",roomId,"\nnewUser : ",newUser);

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
            
            // new user event ( broadcast to room except the new user )
            socket.broadcast.to(roomId).emit('new-user', newUser);
        }

        // callBack();
    });

    socket.on('give-vote',( voteDetails : {
        roomId: string,
        userId: string,
        vote: string,
        votingStatus: boolean
    }) => {
        console.log("on event : give-vote","\nvoteDetails : ", voteDetails);

        //update user of server's room instance
        allRoomDataService.updateRoomUserVote(voteDetails);

        //update user of client's room instance (broadcast to a room)
        io.to(voteDetails.roomId).emit('receive-vote', voteDetails);

    });

    socket.on('revoke-vote',( voteDetails : {
        roomId: string,
        userId: string,
        vote: string,
        votingStatus: boolean
    }) => {
        console.log("on event : revoke-vote","\nvoteDetails : ", voteDetails);

        //update user of server's room instance
        allRoomDataService.updateRoomUserVote(voteDetails);

        //update user of client's room instance (broadcast to a room)
        io.to(voteDetails.roomId).emit('revoke-vote', voteDetails);

    });

    socket.on('reveal-cards',( roomId: string ) => {
        console.log("on event : reveal-cards","\nroomId : ", roomId);

        //update server's room instance
        allRoomDataService.revealRoomCards(roomId);

        //update client's room instance (broadcast to a room)
        io.to(roomId).emit('reveal-cards');
    });

    socket.on('start-new-voting',( roomId: string ) => {
        console.log("on event : start-new-voting","\nroomId : ", roomId);

        // update server's room instance
        // reset room state
        allRoomDataService.startNewVoting(roomId);

        // update client's room instance (broadcast to a room)
        io.to(roomId).emit('start-new-voting');
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected :',socket.id);
    });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});