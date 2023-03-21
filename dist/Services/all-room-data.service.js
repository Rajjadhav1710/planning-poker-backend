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
}
exports.AllRoomDataService = AllRoomDataService;
