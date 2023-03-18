import { Room } from "../Models/room.model";

export class AllRoomDataService {
    private rooms: Room[];

    constructor(){
        this.rooms = [];
    }
}