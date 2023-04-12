"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllRoomDataService = void 0;
class AllRoomDataService {
    constructor() {
        this.rooms = [];
    }
    createRoom(roomDetails) {
        console.log("Executed createRoom : AllRoomDataService");
        const newRoom = {
            roomId: roomDetails.roomId,
            roomName: roomDetails.roomName,
            votingSystem: roomDetails.votingSystem,
            activeUsers: [],
            votingDecks: [
                ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "?"],
                ["0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?"],
                ["0", "1", "2", "4", "8", "16", "32", "64", "?"]
            ],
            averageVote: "",
            agreement: "",
            allCardsRevealed: false
        };
        this.rooms.push(newRoom);
        console.log("new room added (createRoom : AllRoomDataService) : \n", this.rooms);
    }
    getRoomByRoomIndex(roomIndex) {
        return this.rooms[roomIndex];
    }
    getRoomIndex(roomId) {
        let roomIndex = -1;
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].roomId === roomId) {
                roomIndex = i;
            }
        }
        return roomIndex;
    }
    joinRoom(roomId, newUser) {
        console.log("Executed joinRoom : AllRoomDataService");
        let roomIndex = this.getRoomIndex(roomId);
        if (roomIndex === -1) {
            console.log("Room not found (joinRoom : AllRoomDataService)");
        }
        else {
            this.rooms[roomIndex].activeUsers.push(newUser);
            console.log("new user joined (joinRoom : AllRoomDataService), roomId : ", roomId, "\nUser : ", newUser);
        }
    }
    updateRoomUserVote(voteDetails) {
        console.log("Executed updateRoomUserVote : AllRoomDataService");
        let roomIndex = this.getRoomIndex(voteDetails.roomId);
        if (roomIndex === -1) {
            console.log("Room not found (updateRoomUserVote : AllRoomDataService)");
        }
        else {
            let user = this.rooms[roomIndex].activeUsers.filter(user => user.userId === voteDetails.userId)[0];
            if (user === undefined) {
                console.log("User not found (updateRoomUserVote : AllRoomDataService)");
            }
            else {
                user.votingStatus = voteDetails.votingStatus;
                user.vote = voteDetails.vote;
            }
        }
    }
    calculateAverageVote(roomId) {
        console.log("Executed calculateAverageVote : AllRoomDataService");
        let roomIndex = this.getRoomIndex(roomId);
        // this.rooms[roomIndex].allCardsRevealed = true;
        let totalVote = 0; // total of all the votes in the room
        let totalUsersVotted = 0; // count of users who have voted and not given "?" as vote
        let averageVote = 0;
        if (roomIndex === -1) {
            console.log("Room not found (calculateAverageVote : AllRoomDataService)");
        }
        else {
            for (const user of this.rooms[roomIndex].activeUsers) {
                if (user.votingStatus === true && user.vote !== "?") {
                    totalUsersVotted++;
                    totalVote += Number(user.vote);
                }
            }
        }
        averageVote = totalVote / totalUsersVotted;
        return averageVote.toFixed(2);
    }
    // returns coefficient of variation
    getCV(voteWithFrequencyArray) {
        let sum_f = 0;
        let sum_fX = 0;
        for (const item of voteWithFrequencyArray) {
            if (item.vote !== '?') {
                sum_f += item.frequency;
                sum_fX += (Number(item.vote) * item.frequency);
            }
        }
        let mean = sum_fX / sum_f;
        console.log(mean);
        let sum_fx2 = 0;
        for (const item of voteWithFrequencyArray) {
            if (item.vote !== '?') {
                sum_fx2 += ((Number(item.vote) - mean) * (Number(item.vote) - mean) * item.frequency);
            }
        }
        let standardDeviation = Math.sqrt(sum_fx2 / sum_f);
        let coefficientOfVariation = (standardDeviation / mean) * 100;
        return Number(coefficientOfVariation.toFixed(2));
    }
    calculateAgreement(roomId) {
        console.log("Executed calculateAgreement : AllRoomDataService");
        let roomIndex = this.getRoomIndex(roomId);
        if (roomIndex === -1) {
            console.log("Room not found (calculateAgreement : AllRoomDataService)");
        }
        else {
            let voteWithFrequencyArray = this.getVoteWithFrequency(roomId);
            console.log(voteWithFrequencyArray);
            return "" + (100 - this.getCV(voteWithFrequencyArray));
        }
        return "50%";
    }
    revealRoomCards(roomId) {
        console.log("Executed revealRoomCards : AllRoomDataService");
        let roomIndex = this.getRoomIndex(roomId);
        if (roomIndex === -1) {
            console.log("Room not found (revealRoomCards : AllRoomDataService)");
        }
        else {
            this.rooms[roomIndex].allCardsRevealed = true;
            // calculate average vote and agreement
            this.rooms[roomIndex].averageVote = this.calculateAverageVote(roomId);
            this.rooms[roomIndex].agreement = this.calculateAgreement(roomId); // hard coded
        }
    }
    startNewVoting(roomId) {
        console.log("Executed startNewVoting : AllRoomDataService");
        let roomIndex = this.getRoomIndex(roomId);
        if (roomIndex === -1) {
            console.log("Room not found (startNewVoting : AllRoomDataService)");
        }
        else {
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
    getRoomIdByUsingUserId(userId) {
        let roomId = "";
        for (let i = 0; i < this.rooms.length; i++) {
            for (let j = 0; j < this.rooms[i].activeUsers.length; j++) {
                if (this.rooms[i].activeUsers[j].userId === userId) {
                    roomId = this.rooms[i].roomId;
                }
            }
        }
        return roomId;
    }
    removeUser(roomId, userId) {
        console.log("Executed removeUser : AllRoomDataService");
        console.log(`roomId - ${roomId} userId - ${userId} : AllRoomDataService`);
        let roomIndex = this.getRoomIndex(roomId);
        if (roomIndex === -1) {
            console.log("Room not found (removeUser : AllRoomDataService)");
        }
        else {
            this.rooms[roomIndex].activeUsers = this.rooms[roomIndex].activeUsers.filter(user => user.userId !== userId);
            if (this.rooms[roomIndex].activeUsers.length === 0) {
                //delete room details
                console.log(`Deleted room - ${roomId} because no active users (removeUser : AllRoomDataService)`);
                this.rooms = this.rooms.filter(room => room.roomId !== roomId);
            }
            else {
                let isThereAnyAdmin = false;
                for (const user of this.rooms[roomIndex].activeUsers) {
                    if (user.isAdmin) {
                        isThereAnyAdmin = true;
                        break;
                    }
                }
                if (!isThereAnyAdmin) {
                    //Randomly choose any one as admin
                    // let userIndex: number = Math.floor(Math.random() * this.rooms[roomIndex].activeUsers.length);
                    console.log(`Selected new admin with userId - ${this.rooms[roomIndex].activeUsers[0].userId} for roomId - ${roomId} : (removeUser : AllRoomDataService)`);
                    this.rooms[roomIndex].activeUsers[0].isAdmin = true;
                }
            }
        }
    }
    getVoteWithFrequency(roomId) {
        let roomIndex = this.getRoomIndex(roomId);
        let result = [];
        if (roomIndex === -1) {
            console.log("Room not found (getVoteWithFrequency : AllRoomDataService)");
        }
        else {
            for (let i = 0; i < this.rooms[roomIndex].activeUsers.length; i++) {
                if (this.rooms[roomIndex].activeUsers[i].votingStatus === true) {
                    let searchedItem = result.find(r => r.vote === this.rooms[roomIndex].activeUsers[i].vote);
                    if (searchedItem) {
                        searchedItem.frequency++;
                    }
                    else {
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
exports.AllRoomDataService = AllRoomDataService;
