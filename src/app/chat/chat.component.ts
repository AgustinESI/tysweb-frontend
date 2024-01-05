import { Component } from '@angular/core';
import { MessageTypes } from './enum';
import { ActivatedRoute } from '@angular/router';
import { UserChat } from '../user-chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  private websocketURL: string = 'ws://localhost:8080/ws-chat';
  private ws: WebSocket | undefined;
  public user_name: string = '';
  public users_list: UserChat[] = [];
  public input_message: string | undefined;
  public receiver: string = '';
  public messages_list_by_receiver = new Map<string, string[]>();
  public status: string = 'Disconnected';
  private _add: boolean = true;

  constructor(private route: ActivatedRoute) {
    this.ws = undefined;
    this.input_message = undefined;
  }


  ngOnInit() {

    if (localStorage) {
      const _user_name_ = localStorage.getItem("user_name");
      if (_user_name_) {
        this.user_name = _user_name_;
      }
    } else {
      alert('localStorage is not supported');
    }

    this.ws = new WebSocket(this.websocketURL);
    for (var i = 0; this.users_list.length; i++) {

    }
      this.ws.onopen = () => {
        let msg = {
          type: MessageTypes.INDENT,
          name: this.user_name,
        };
        this._sendMessage(JSON.stringify(msg));
        this.status = 'Connected';
      };

    this.ws.onmessage = (event) => {
      var data = event.data;
      console.log('Received message:', data);
      data = JSON.parse(data);

      if (data.type == MessageTypes.PRIVATE_MESSAGE) {
        let sender = data.sender;
        let content = data.content;
        let message = "<strong>" + sender + "</strong>: " + content;

        let _messages = this.messages_list_by_receiver.get(sender);
        if (!_messages) {
          _messages = [];
          _messages.push(
            '<div class="media w-50 mb-3"> <img src="https://icons.iconarchive.com/icons/iconarchive/incognito-animal-2/128/Dog-icon.png" alt="user" width="50" class="rounded-circle" /> <div class="media-body ml-3"> <div class="bg-light rounded py-2 px-3 mb-2"> <p class="text-small mb-0 text-muted"> ' + message + '</p> </div> </div> </div>'
          );
          this.messages_list_by_receiver.set(sender, _messages);
        } else {
          this._printMessageTheir(message);
        }


      }

      if (data.type == MessageTypes.NEW_USER) {
        let name = data.name;
        this._addUser(name);
      }

      if (data.type == MessageTypes.CLOSED_SESSION) {
        let name = data.name;
        let closedUser = document.getElementById(name);
        if (closedUser) {
          closedUser.remove();
        } else {
          console.log('Elemento no encontrado o ya eliminado.');
        }
      }


      if (data.type == MessageTypes.WELCOME) {
        let usuarios = data.users;
        for (let i = 0; i < usuarios.length; i++) {
          let name = usuarios[i];
          this._addUser(name);
        }
      }

    };

    this.ws.onclose = (event) => {
      if (this.ws) this.ws.close();
      this.users_list = this.users_list.filter((user) => user.name !== this.receiver);
      this.messages_list_by_receiver.delete(this.receiver);
      console.log(this.users_list)
      this.receiver = '';
    };

  }

  _printMessageOur(message: string) {
    let _messages = this.messages_list_by_receiver.get(this.receiver);
    if (!_messages) {
      _messages = [];
    }
    _messages.push(
      '<div class="message-our media w-50 ml-auto mb-3"> <div class="media-body"> <div class="bg-primary rounded py-2 px-3 mb-2"> <p class="text-small mb-0 text-white">' + message + '</p> </div> <p class="small text-muted">' + this.formatHour() + ' | ' + this.formatDate(new Date()) + '</p> </div> </div>'
    );
    this.messages_list_by_receiver.set(this.receiver, _messages);

    const scrollableDiv = document.getElementById("chat") as HTMLDivElement;
    const scrollAmount = 1000000000000;
    scrollableDiv.scrollTop += scrollAmount;
  }

  _printMessageTheir(message: string) {
    if (this.receiver) {
      let _messages = this.messages_list_by_receiver.get(this.receiver);
      if (!_messages) {
        _messages = [];
      }

      _messages.push(
        '<div class="media w-50 mb-3"><img src="https://icons.iconarchive.com/icons/iconarchive/incognito-animal-2/128/Cat-icon.png" alt="user" width="50" class="rounded-circle"> <div class="media-body ml-3"> <div class="bg-light rounded py-2 px-3 mb-2"> <p class="text-small mb-0 text-muted">' + message + '</p> </div> <p class="small text-muted">' + this.formatHour() + ' | ' + this.formatHour() + '</p> </div> </div>'
      );
      this.messages_list_by_receiver.set(this.receiver, _messages);
    }

    const scrollableDiv = document.getElementById("chat") as HTMLDivElement;
    const scrollAmount = 1000000000000;
    scrollableDiv.scrollTop += scrollAmount;
  }

  _addUser(name: string) {
    let _user = new UserChat();
    _user.name = name;
    _user.date = this.formatDate(new Date());
    this.users_list.push(_user);
  }

  getReceiver(name: string) {
    this.receiver = name;


    if (this.receiver) {
      let _messages = this.messages_list_by_receiver.get(this.receiver);
      if (!_messages) {
        _messages = [];
      }

      _messages.push(
        '<div class="media w-100 ml-auto mb-3 text-center"> <div class="media-body"> <div class="bg-secondary rounded py-2 px-3 mb-2"> <p class="text-small mb-0 text-white"> Chatting with: ' + this.receiver + ' </p> </div> </div> </div>'
      );
      this.messages_list_by_receiver.set(this.receiver, _messages);
    }

  }

  _sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.warn('WebSocket connection is not open. Message not sent.');
    }
  }

  sendMessage() {
    // Check if the WebSocket connection is open
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {

      if (this.receiver) {
        let msg = {
          type: MessageTypes.PRIVATE_MESSAGE,
          receiver: this.receiver,
          content: this.input_message,
        };

        // Send the message to the WebSocket server
        this.ws.send(JSON.stringify(msg));
        if (this.input_message) {
          this._printMessageOur(this.input_message);
        }
        this.input_message = '';
      } else {
        alert("Please select a user");
      }

    } else {
      console.warn('WebSocket connection is not open. Message not sent.');
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  }

  formatHour(): string {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  ngOnDestroy() {
    // Clean up when the component is destroyed
    if (this.ws) this.ws.close();
    this.users_list = this.users_list.filter((user) => user.name !== this.receiver);
    this.messages_list_by_receiver.delete(this.receiver);
    this.receiver = '';

  }



}
