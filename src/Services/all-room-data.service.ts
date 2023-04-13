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
                ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "?"],
                ["0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?"],
                ["0", "1", "2", "4", "8", "16", "32", "64", "?"]
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
    }): number {// returns status of update : 0 = success, -1 = error
        console.log("Executed updateRoomUserVote : AllRoomDataService");

        let roomIndex: number = this.getRoomIndex(voteDetails.roomId);

        if(roomIndex === -1){
            console.log("Room not found (updateRoomUserVote : AllRoomDataService)");
            return -1;
        }else{
            let user: User = this.rooms[roomIndex].activeUsers.filter(user => user.userId === voteDetails.userId)[0];

            if(user === undefined){
                console.log("User not found (updateRoomUserVote : AllRoomDataService)");
                return -1;
            }else{
                user.votingStatus = voteDetails.votingStatus;
                user.vote = voteDetails.vote;
            }
        }

        return 0;
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

        return averageVote.toFixed(2);
    }

    // returns coefficient of variation
    getCV(voteWithFrequencyArray: { // calculates disagreement in percentage
        vote: string; // X
        frequency: number; // f
    }[]): number {
        let sum_f: number = 0;
        let sum_fX: number = 0;
    
        for (const item of voteWithFrequencyArray) {
            if(item.vote !== '?'){
                sum_f += item.frequency;
                sum_fX += (Number(item.vote)*item.frequency);
            }
        }

        let mean: number = sum_fX / sum_f;
        console.log(mean);    
        let sum_fx2: number = 0;

        for (const item of voteWithFrequencyArray) {
            if(item.vote !== '?'){
                sum_fx2 += ((Number(item.vote)-mean)*(Number(item.vote)-mean)*item.frequency);
            }
        }

        let standardDeviation: number = Math.sqrt(sum_fx2/sum_f);

        let coefficientOfVariation: number = (standardDeviation / mean)*100;

        return Number(coefficientOfVariation.toFixed(2));
    }

    calculateAgreement( roomId: string ): string {
        console.log("Executed calculateAgreement : AllRoomDataService");

        let roomIndex: number = this.getRoomIndex(roomId);

        if(roomIndex === -1){
            console.log("Room not found (calculateAgreement : AllRoomDataService)");
        }else{
            let voteWithFrequencyArray: {
                vote: string; // X
                frequency: number; // f
            }[] = this.getVoteWithFrequency(roomId);
          
            console.log(voteWithFrequencyArray);
          
            return ""+(100 - this.getCV(voteWithFrequencyArray));
        }

        return "50%";
    }

    revealRoomCards( roomId: string ): number {// returns status of update : 0 = success, -1 = error
        console.log("Executed revealRoomCards : AllRoomDataService");
        
        let roomIndex: number = this.getRoomIndex(roomId);

        if(roomIndex === -1){
            console.log("Room not found (revealRoomCards : AllRoomDataService)");
            return -1;
        }else{
            this.rooms[roomIndex].allCardsRevealed = true;
            
            // calculate average vote and agreement
            this.rooms[roomIndex].averageVote = this.calculateAverageVote(roomId);
            this.rooms[roomIndex].agreement = this.calculateAgreement(roomId); // hard coded
        }

        return 0;
    }

    startNewVoting( roomId: string ): number {// returns status of update : 0 = success, -1 = error
        console.log("Executed startNewVoting : AllRoomDataService");

        let roomIndex: number = this.getRoomIndex(roomId);

        if(roomIndex === -1){
            console.log("Room not found (startNewVoting : AllRoomDataService)");
            return -1;
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

        return 0;
    }

    getRoomIdByUsingUserId(userId: string): string {
        let roomId: string = "";

        for(let i = 0; i < this.rooms.length; i++){
            for(let j = 0; j < this.rooms[i].activeUsers.length; j++){
                if(this.rooms[i].activeUsers[j].userId === userId){
                    roomId = this.rooms[i].roomId;
                }
            }
        }

        return roomId;
    }

    removeUser(roomId: string, userId: string): void {
        console.log("Executed removeUser : AllRoomDataService");
        console.log(`roomId - ${roomId} userId - ${userId} : AllRoomDataService`);
        
        let roomIndex: number = this.getRoomIndex(roomId);

        if(roomIndex === -1){
            console.log("Room not found (removeUser : AllRoomDataService)");
        }else{
            this.rooms[roomIndex].activeUsers = this.rooms[roomIndex].activeUsers.filter(user => user.userId !== userId);

            if(this.rooms[roomIndex].activeUsers.length === 0){
                //delete room details
                console.log(`Deleted room - ${roomId} because no active users (removeUser : AllRoomDataService)`);
                
                this.rooms = this.rooms.filter(room => room.roomId !== roomId);
            }else{
                let isThereAnyAdmin: boolean = false;

                for (const user of this.rooms[roomIndex].activeUsers) {
                    if(user.isAdmin){
                        isThereAnyAdmin = true;
                        break;
                    }
                }

                if(!isThereAnyAdmin){
                    //Randomly choose any one as admin
                    // let userIndex: number = Math.floor(Math.random() * this.rooms[roomIndex].activeUsers.length);
                    console.log(`Selected new admin with userId - ${this.rooms[roomIndex].activeUsers[0].userId} for roomId - ${roomId} : (removeUser : AllRoomDataService)`);
                    
                    this.rooms[roomIndex].activeUsers[0].isAdmin = true;
                }
            }
        }
    }

    getVoteWithFrequency(roomId: string): {
        vote: string;
        frequency: number;
    }[]{

        let roomIndex: number = this.getRoomIndex(roomId);

        let result: {
            vote: string;
            frequency: number;
        }[] = [];

        if(roomIndex === -1){
            console.log("Room not found (getVoteWithFrequency : AllRoomDataService)");
        }else{
            for(let i=0; i<this.rooms[roomIndex].activeUsers.length; i++){
                if(this.rooms[roomIndex].activeUsers[i].votingStatus === true){
                  let searchedItem: {
                    vote: string;
                    frequency: number;
                  } | undefined = result.find( r => r.vote === this.rooms[roomIndex].activeUsers[i].vote);
          
                  if(searchedItem){
                    searchedItem.frequency++;
                  }else{
                    result.push({
                      vote: this.rooms[roomIndex].activeUsers[i].vote,
                      frequency: 1
                    });
                  }
                }
            }
        }

        return result;
    }
}