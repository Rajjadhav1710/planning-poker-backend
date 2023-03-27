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
        console.log("Executed createRoom : AllRoomDataService");
        
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

        console.log("new room added (createRoom : AllRoomDataService) : \n", this.rooms);
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
        console.log("Executed joinRoom : AllRoomDataService");

        let roomIndex: number = this.getRoomIndex(roomId);

        if(roomIndex === -1){
            console.log("Room not found (joinRoom : AllRoomDataService)");
        }else{
            this.rooms[roomIndex].activeUsers.push(newUser);
            console.log("new user joined (joinRoom : AllRoomDataService), roomId : ", roomId,"\nUser : ", newUser);
        }
    }

    updateRoomUserVote( voteDetails : {
        roomId: string,
        userId: string,
        vote: string,
        votingStatus: boolean
    }): void {
        console.log("Executed updateRoomUserVote : AllRoomDataService");

        let roomIndex: number = this.getRoomIndex(voteDetails.roomId);

        if(roomIndex === -1){
            console.log("Room not found (updateRoomUserVote : AllRoomDataService)");
        }else{
            let user: User = this.rooms[roomIndex].activeUsers.filter(user => user.userId === voteDetails.userId)[0];

            if(user === undefined){
                console.log("User not found (updateRoomUserVote : AllRoomDataService)");
            }else{
                user.votingStatus = voteDetails.votingStatus;
                user.vote = voteDetails.vote;
            }
        }
    }

    calculateAverageVote( roomId: string ): string {
        console.log("Executed calculateAverageVote : AllRoomDataService");

        let roomIndex: number = this.getRoomIndex(roomId);

        // this.rooms[roomIndex].allCardsRevealed = true;
        let totalVote: number = 0; // total of all the votes in the room
        let totalUsersVotted: number = 0; // count of users who have voted and not given "?" as vote
        let averageVote: number = 0;

        if(roomIndex === -1){
            console.log("Room not found (calculateAverageVote : AllRoomDataService)");
        }else{
            for (const user of this.rooms[roomIndex].activeUsers) {
                if(user.votingStatus === true && user.vote !== "?"){
                    totalUsersVotted++;
                    totalVote += Number(user.vote);
                }
            }
        }

        averageVote = totalVote/totalUsersVotted;

        return averageVote.toString();
    }

    calculateAgreement( roomId: string ): string {
        return "50%";
    }

    revealRoomCards( roomId: string ): void {
        console.log("Executed revealRoomCards : AllRoomDataService");
        
        let roomIndex: number = this.getRoomIndex(roomId);

        if(roomIndex === -1){
            console.log("Room not found (revealRoomCards : AllRoomDataService)");
        }else{
            this.rooms[roomIndex].allCardsRevealed = true;
            
            // calculate average vote and agreement
            this.rooms[roomIndex].averageVote = this.calculateAverageVote(roomId);
            this.rooms[roomIndex].agreement = this.calculateAgreement(roomId); // hard coded
        }
    }

    startNewVoting( roomId: string ): void {
        console.log("Executed startNewVoting : AllRoomDataService");

        let roomIndex: number = this.getRoomIndex(roomId);

        if(roomIndex === -1){
            console.log("Room not found (startNewVoting : AllRoomDataService)");
        }else{
            // reset room state
            for (const user of this.rooms[roomIndex].activeUsers) {
                user.votingStatus = false;
                user.vote = "";
            }
            this.rooms[roomIndex].averageVote = "";
            this.rooms[roomIndex].agreement = "";
            this.rooms[roomIndex].allCardsRevealed = false;
        }
    }
}