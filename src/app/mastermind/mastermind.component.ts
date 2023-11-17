import { Component, ViewChild } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Match } from '../four-in-line/match';
import { MatchService } from '../match-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../user';
import { MessageTypesGames } from '../chat/enum';
import { post } from 'jquery';


@Component({
  selector: 'app-mastermind',
  templateUrl: './mastermind.component.html',
  styleUrls: ['./mastermind.component.css']
})
export class MastermindComponent {

  @ViewChild('alert')
  alert!: NgbAlert;
  public matchAux: Match = new Match;
  public match: Match = new Match;

  public endGame: boolean = false;
  public gameBanner: boolean = false;
  private ws: WebSocket | undefined;
  private websocketURL: string = 'ws://localhost:8080/ws-matches';

  public colors: string[] = [];
  public messageAlert: string = '';
  public showAlert: boolean = false;
  public alertType: string = '';
  private _user_name: string = '';

  constructor(private matchService: MatchService, private router: Router, private http: HttpClient) {
    this.match = new Match();
  }

  ngOnInit() {
    if (localStorage) {
      const _user_name_ = localStorage.getItem("user_name");
      if (_user_name_) {
        this._user_name = _user_name_;
      }
    } else {
      alert('localStorage is not supported');
    }
    this.matchService.startMasterMindGame().subscribe(
      (data) => {
        this._parseBoard(data, true);
        this._manageWS();
      },
      (error) => {
        this.showSuccessAlert(error.error.message, 'danger');
      }
    );
  }

  private _parseBoard(data: any, turn: boolean) {
    this.match = { ...this.match, ...data };
    const _board: string[][] = data.boardList[0].board.map((row: string) => row.split(''));
    this.match.boardList[0].board = _board;
    this.matchAux.boardList[0].board = this.match.boardList[0].board.slice();
    var position = this._getLastLine();
    if (turn) {
      position--;
    }

    var i = 0;
    if (position % 2 === 1) {
      i = 1;
    }
    for (i; i < position; i = i + 2) {
      for (var j = 0; j < this.match.boardList[0].board[i].length / 2; j++) {
        this.matchAux.boardList[0].board[i][j] = '?';
      }
    }
    if (this.match.winner) {
      this.endGame = true;
      this.gameBanner = true;
      setTimeout(() => {
        this.gameBanner = false;
      }, 10000);
    }

  }

  showSuccessAlert(_message: string, _type: string) {
    this.alertType = _type;
    this.messageAlert = _message;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
      this.alert.close();
    }, 5000);

  }

  public checkCurrent(user: User): any {
    if (user.name === this.match.currentUser?.name) {
      return true;
    }
    return false;
  }

  getColorStyle(color: string): any {
    switch (color) {
      case 'K': return { 'background': 'radial-gradient(circle at 30% 30%, #828282, #0d0d0d)' };
      case 'B': return { 'background': 'radial-gradient(circle at 30% 30%, #76cbff, #004875)' };
      case 'M': return { 'background': 'radial-gradient(circle at 30% 30%, #c82f00, #4f1502)' };
      case 'G': return { 'background': 'radial-gradient(circle at 30% 30%, lime, #006900)' };
      case 'O': return { 'background': 'radial-gradient(circle at 30% 30%, #ffaf32, #794c06)' };
      case 'R': return { 'background': 'radial-gradient(circle at 30% 30%, red, #9b0000)' };
      case 'P': return { 'background': 'radial-gradient(circle at 30% 30%, #d384ff, #6d2b91)' };
      case 'Y': return { 'background': 'radial-gradient(circle at 30% 30%, #ffff21,#737313)' };
      case 'w': return { 'background': 'radial-gradient(circle at 30% 30%, #ffffff, #666666)' };
      case 'b': return { 'background': 'radial-gradient(circle at 30% 30%, #828282, #0d0d0d)' };
      case '-': return { 'background': '#eca276' };
      case '?': return { 'font-size': '15px', 'color': 'white', 'background': 'radial-gradient(circle at 30% 30%, #fa965d, #7d492a)' };
      default: return {};
    };
  }

  addColor(color: string) {
    var user: User = new User();
    user.name = this._user_name

    if (this.checkCurrent(user)) {
      if (this.colors.length < 6) {
        this.colors.push(color);
        for (let i = 0; i < this.match.boardList[0].board.length; i++) {
          let state = false;
          for (let j = 0; j < this.match.boardList[0].board[i].length / 2; j++) {
            if (this.match.boardList[0].board[i][j] == '-') {
              state = true;
              break;
            }
          }
          if (state) {
            this.match.boardList[0].board[i][this.colors.length - 1] = color;
            break;
          }
        }
      } if (this.colors.length == 6) {

        const colorString = this.colors.join(',');
        let json = {
          id_match: this.match.id_match,
          colors: colorString
        }

        this.matchService.addColor(JSON.stringify(json)).subscribe(
          (data) => {
            this._parseBoard(data, false);

            const receiver = this._getOtherUser();
            let msg = {
              type: MessageTypesGames.GAME_MOVEMENTS_MADE,
              id_match: this.match.id_match,
              receiver: receiver
            };

            this._sendMessage(JSON.stringify(msg));
            this.colors = [];
          },
          (error) => {
            this.showSuccessAlert(error.error.message, 'danger');
          }
        );
      }
    }
  }
  private _getOtherUser() {
    var out = '';

    if (this.match.currentUser) {
      out = this.match.currentUser.name;
    }

    for (var user of this.match.players) {
      if (user.name !== this._user_name) {
        out = (user as User).name;
      }
    }


    return out;
  }
  private _sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      this.showSuccessAlert('WebSocket connection is not open. Message not sent.', 'danger');
    }
  }
  private _manageWS() {
    this.ws = new WebSocket(this.websocketURL);

    this.ws.onopen = () => {

      let msg = {
        type: MessageTypesGames.GAME_START,
        name: this._user_name,
        id_match: this.match.id_match
      }

      this._sendMessage(JSON.stringify(msg));

      if (this.match.players.length == 2) {

        const filteredUsers = this.match.players.filter(user => user.name !== this._user_name);

        let msg = {
          type: MessageTypesGames.GAME_SECOND_PLAYER_ADDED,
          id_match: this.match.id_match,
          name: this._user_name,
          receiver: filteredUsers[0].name,
        };
        this._sendMessage(JSON.stringify(msg));
      }

    };

    this.ws.onmessage = (event) => {
      var data = event.data;
      data = JSON.parse(data);

      switch (data.type) {
        case MessageTypesGames.GAME_UPDATE_MATCH:
          this._getMatch();
          break;
      }
    };

    this.ws.onclose = (event) => {

    };
  }
  private _getMatch() {
    this.matchService.getMatch(this.match.id_match).subscribe(
      (data) => {
        this._parseBoard(data, true);
      },
      (error) => {
        this.showSuccessAlert(error.error.message, 'danger');
      }
    );
  }


  private _getLastLine() {
    var position;
    for (position = 0; position < this.match.boardList[0].board.length; position++) {
      if (this.match.boardList[0].board[position][0] == '-')
        break;
    }
    return position
  }
}
