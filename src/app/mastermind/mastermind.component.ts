import { Component, ViewChild } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Match } from '../four-in-line/match';
import { MatchService } from '../match-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../user';
import { GameType, MessageTypesGames } from '../chat/enum';
import { post } from 'jquery';
import { UserService } from '../user-service';
import { UserMatchesInfo } from '../usermatchesinfo';
declare var bootstrap: any;

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
  //private websocketURL: string = 'ws://192.168.18.42:8080/ws-matches';
  private websocketURL: string = 'ws://localhost:8080/ws-matches';
  isModalOpen = false;
  public colors: string[] = [];
  public messageAlert: string = '';
  public showAlert: boolean = false;
  public alertType: string = '';
  private _user_name: string = '';
  private _user_id: string = '';
  private userMatchesInfo: UserMatchesInfo | undefined;


  constructor(private matchService: MatchService, private router: Router, private http: HttpClient, private userService: UserService) {
    this.match = new Match();
  }


  ngOnInit(): void {
    if (localStorage) {
      const _user_name_ = localStorage.getItem("user_name");
      const _user_id_ = localStorage.getItem("user_id");


      if (_user_name_) {
        this._user_name = _user_name_;
      }
      if (_user_id_) {
        this._user_id = _user_id_;
      }
    } else {
      alert('localStorage is not supported');
    }

    document.cookie = "id_user=" + this._user_id + "; expires=Thu, 01 Jan 2099 00:00:00 GMT; path=/";
    const headers = { 'Content-Type': 'application/json', 'Cookie': document.cookie };
    this.matchService.start(GameType.MASTER_MIND, headers).subscribe(
      (data) => {
        console.log(data)
        this._parseBoard(data, true);
        this._manageWS();
        for (var i = 0; i < this.match.players.length; i++) {
          if (this.match.players[i].name === this._user_name) {
            localStorage.setItem("user_paidMatches", this.match.players[i].paidMatches.toString())
            break
          }
        }
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
    if (i != 13) {
      for (i; i <= position; i = i + 2) {
        for (var j = 0; j < this.match.boardList[0].board[i].length / 2; j++) {
          this.matchAux.boardList[0].board[i][j] = '?';
        }
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
      case '-': return { 'background': 'rgba(228, 210, 185, 0)', 'box-shadow': 'rgb(179, 166, 151) 5px 5px 5px 1px inset;' };


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
          combination: colorString
        }

        document.cookie = "id_user=" + this._user_id + "; expires=Thu, 01 Jan 2099 00:00:00 GMT; path=/";
        const headers = { 'Content-Type': 'application/json', 'Cookie': document.cookie };
        this.matchService.add(JSON.stringify(json), headers).subscribe(
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
    }else{
      this.showSuccessAlert('Ilegal movement, not your turn', 'warning')
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
        case MessageTypesGames.GAME_END:

          var value = {
            id_match: this.match.id_match,
            id_user: this._user_id
          }
          document.cookie = "id_user=" + this._user_id + "; expires=Thu, 01 Jan 2099 00:00:00 GMT; path=/";
          const headers = { 'Content-Type': 'application/json', 'Cookie': document.cookie };
          this.matchService.gameEnd(value, headers).subscribe(
            (data) => {

              this._parseBoard(data, false);

            },
            (error) => {
              this.showSuccessAlert(error.error.message, 'danger');
            }
          );
          break;
      }
    };

    this.ws.onclose = (event) => {
      let message = {
        id_match: this.match.id_match,
        name: this._user_name,
        receiver: this._getOtherUser(),
        type: MessageTypesGames.LEFT_MATCH
      }
      this._sendMessage(JSON.stringify(message));
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


  openModal() {
    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    myModal.show();
  }

  closeModal() {
    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    myModal.hide();
  }

}
