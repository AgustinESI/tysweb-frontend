import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {


  @ViewChild('alert')
  alert!: NgbAlert;

  constructor(private router: Router, private http: HttpClient) { }

  user_id: string = "";
  user_name: string = '';
  messageAlert: string = '';
  showAlert: boolean = false;
  alertType: string = '';

  ngOnInit(): void {

    if (localStorage) {
      const _user_name_ = localStorage.getItem("user_name");
      if (_user_name_) {
        this.user_name = _user_name_;
      }
    } else {
      console.error('localStorage is not supported');
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
