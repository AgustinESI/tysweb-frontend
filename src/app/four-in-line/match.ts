import { User } from '../user';
import { Board } from './board';

export class Match {
    id_match: any;
    winner: User | null = null;
    end: boolean = false;
    boardList: Board[] = [];
    players: User[] = [];
    currentUser: User | null = null;


    constructor() {
        this.boardList.push(new Board());
    }
}
