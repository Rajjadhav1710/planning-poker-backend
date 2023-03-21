import { User } from "./user.model";

export interface Room{
    roomId: string;
    roomName: string; // room's display name
    votingSystem: string;
    activeUsers: User[];
    votingDecks: string[][];
    averageVote: string;
    agreement: string;
    allCardsRevealed: boolean;
}