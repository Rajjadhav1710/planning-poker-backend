"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllRoomDataService = void 0;
class AllRoomDataService {
    constructor() {
        this.rooms = [];
    }
    createRoom(roomDetails) {
        const newRoom = {
            roomId: roomDetails.roomId,
            roomName: roomDetails.roomName,
            votingSystem: roomDetails.votingSystem,
            activeUsers: [],
            votingDecks: [
                ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "?"]
            ],
            averageVote: "",
            agreement: "",
            allCardsRevealed: false
        };
        this.rooms.push(newRoom);
        console.log("new room added : ", this.rooms);
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
        let roomIndex = this.getRoomIndex(roomId);
        if (roomIndex === -1) {
            console.log("Room not found");
        }
        else {
            this.rooms[roomIndex].activeUsers.push(newUser);
            console.log("new user joined, roomId : ", roomId, "\nUser : ", newUser);
        }
    }
}
exports.AllRoomDataService = AllRoomDataService;
