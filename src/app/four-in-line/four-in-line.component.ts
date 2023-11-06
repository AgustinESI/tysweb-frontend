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

    this.match.board[row][col] = 'X';

  }


}
