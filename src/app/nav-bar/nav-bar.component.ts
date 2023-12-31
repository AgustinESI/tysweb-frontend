import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../user';
import { UserService } from '../user-service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {


  @ViewChild('alert')
  alert!: NgbAlert;



  constructor() { }
  user_name: string | null = '';
  user_image: string | null = '';
  registered: boolean = false;
  messageAlert: string = '';
  showAlert: boolean = false;
  alertType: string = '';
  user_paidMatches: number = 0;

  _profile_image: any

  ngOnInit(): void {

    if (localStorage) {
      const _user_id_ = localStorage.getItem("user_id");
      if (_user_id_) {
        this.registered = true;
        this.user_name = localStorage.getItem("user_name");
        this.user_image = localStorage.getItem('user_img');
        const paidMatchesString = localStorage.getItem('user_paidMatches');
        this.user_paidMatches = paidMatchesString ? parseInt(paidMatchesString, 10) : 0;

      }
    }
  }

  closeSession() {
    this.showSuccessAlert('Closed session', 'warning');
    localStorage.clear();
    window.location.href = 'index.html';
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

}
