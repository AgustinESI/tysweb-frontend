import { Component } from '@angular/core';
import { board } from './board';

@Component({
  selector: 'app-four-in-line',
  templateUrl: './four-in-line.component.html',
  styleUrls: ['./four-in-line.component.css']
})
export class FourInLineComponent {
  match: board;
  constructor() {
    this.match = new board();
  }


  add(row: number, col: number) {
    console.log('File:' + row + ' Col:' + col);

    if (this.availableAdd(row)) {
      this.match.board[row][col] = 'X';
    } else {
      console.log('Not availablle movement');
    }
  }

  availableAdd(col: number): boolean {
    /*
        for (let i = 0; i < this.match.board.length; i++) {
          console.log("Block statement execution no." + i);
        }
    */
    return true;


  }

}
