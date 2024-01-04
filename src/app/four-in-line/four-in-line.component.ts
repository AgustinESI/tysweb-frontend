import { Component, ViewChild } from '@angular/core';
import { Board } from './board';
import { MatchService } from '../match-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Match } from './match';
import { UserService } from '../user-service';
import { GameType, MessageTypesGames } from '../chat/enum';
import { Movement } from './movement';
import { User } from '../user';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { UserMatchesInfo } from '../usermatchesinfo';

@Component({
  selector: 'app-four-in-line',
  templateUrl: './four-in-line.component.html',
  styleUrls: ['./four-in-line.component.css']
})
export class FourInLineComponent {

  @ViewChild('alert')
  alert!: NgbAlert;

  public match: Match;
  //private websocketURL: string = 'ws://192.168.18.42:8080/ws-matches';
  private websocketURL: string = 'ws://localhost:8080/ws-matches';
  private ws: WebSocket | undefined;
  private _user_name: string = '';
  private _user_id: string = '';
  public endGame: boolean = false;
  public gameBanner: boolean = false;

  public messageAlert: string = '';
  public showAlert: boolean = false;
  public alertType: string = '';
  private userMatchesInfo: UserMatchesInfo | undefined;


  constructor(private matchService: MatchService, private router: Router, private http: HttpClient, private userService: UserService) {
    this.match = new Match();
  }

  ngOnInit() {

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
    this.matchService.start(GameType.FOUR_IN_LINE, headers).subscribe(
      (data) => {
        this._parseBoard(data);
        this._manageWS();
      },
      (error) => {
        this.showSuccessAlert(error.error.message, 'danger');
      }
    );
  }

  doMovement(row: number, col: number) {
    var color = '';

    for (var user of this.match.players) {
      if (user.name == this._user_name) {
        color = (user as User).color;
      }
    }

    var body = {
      id_match: this.match.id_match,
      combination: col
    }

    document.cookie = "id_user=" + this._user_id + "; expires=Thu, 01 Jan 2099 00:00:00 GMT; path=/";
    const headers = { 'Content-Type': 'application/json', 'Cookie': document.cookie };
    this.matchService.add(JSON.stringify(body), headers).subscribe(
      (data) => {
        this._parseBoard(data);

        const receiver = this._getOtherUser();
        let msg = {
          type: MessageTypesGames.GAME_MOVEMENTS_MADE,
          id_match: this.match.id_match,
          receiver: receiver
        };

        this._sendMessage(JSON.stringify(msg));
      },
      (error) => {
        this.showSuccessAlert(error.error.message, 'danger');
      }
    );

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

  private _sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      this.showSuccessAlert('WebSocket connection is not open. Message not sent.', 'danger');
    }
  }

  private _getMatch() {
    this.matchService.getMatch(this.match.id_match).subscribe(
      (data) => {
        this._parseBoard(data);
      },
      (error) => {
        this.showSuccessAlert(error.error.message, 'danger');
      }
    );
  }

  private _parseBoard(data: any) {
    this.match = { ...this.match, ...data };
    const _board: string[][] = data.boardList[0].board.map((row: string) => row.split(''));
    this.match.boardList[0].board = _board;

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

}