import { Room } from "../Models/room.model";

export class AllRoomDataService {
    private rooms: Room[];

    constructor(){
        this.rooms = [];
    }

    createRoom(roomDetails : { 
        roomId: string, 
        roomName: string, 
        votingSystem: string 
    }): void{
        const newRoom: Room = {
            roomId: roomDetails.roomId,
            roomName: roomDetails.roomName,
            votingSystem: roomDetails.votingSystem,
            activeUsers: [],
            votingDecks: [
                ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "?"]
            ], // string[][]
            averageVote: "",
            agreement: "",
            allCardsRevealed: false
        };

        this.rooms.push(newRoom);

        console.log("new room added : ", this.rooms);
    }
}