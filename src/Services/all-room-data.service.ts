import { Room } from "../Models/room.model";
import { User } from "../Models/user.model";

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

    getRoomByRoomIndex( roomIndex: number ): Room{
        return this.rooms[roomIndex];
    }

    getRoomIndex( roomId: string ): number {
        let roomIndex: number = -1;

        for(let i = 0; i < this.rooms.length; i++) {
            if(this.rooms[i].roomId === roomId){
                roomIndex = i;
            }
        }

        return roomIndex;
    }

    joinRoom( roomId: string, newUser: User ): void {
        let roomIndex: number = this.getRoomIndex(roomId);

        if(roomIndex === -1){
            console.log("Room not found");
        }else{
            this.rooms[roomIndex].activeUsers.push(newUser);
            console.log("new user joined, roomId : ", roomId,"\nUser : ", newUser);
        }
    }
}