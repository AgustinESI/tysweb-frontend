
export class Movement {
    id_match: any;
    id_board: any;
    col: number | null = null;
    color: string = '';


    constructor(id_match: string, id_board: string, col: number, color: string) {
        this.id_match = id_match;
        this.id_board = id_board;
        this.col = col;
        this.color = color;
    }
}
