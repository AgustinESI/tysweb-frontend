import { Game } from "./game";

export class UserMatchesInfo {
    win!: number;
    lost!: number;
    total!: number;
    draw!: number;
    games: Game[]=[];
    
}
