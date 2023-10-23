import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @ViewChild('alert')
  alert!: NgbAlert;

  login: boolean = false;
  userName: string = '';
  user: User = new User();
  messageAlert: string = '';
  showAlert: boolean = false;
  alertType: string = '';

  constructor(private userService: UserService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    if (localStorage != null) {
      const _userName = localStorage.getItem('user_name');
      if (_userName !== null && _userName !== undefined) {
        this.login = true;
        this.userName = _userName;
      }
    }
  }

  loginForm = new FormGroup({
    email: new FormControl(''),
    pwd: new FormControl('')
  }
  )

  doLogin() {
    if (this.loginForm.valid) {
      const _email = this.loginForm.get('email')?.value;
      const _pwd = this.loginForm.get('pwd')?.value;


      if (_email !== null && _email !== undefined) {
        this.user.email = _email;
      }
      if (_pwd !== null && _pwd !== undefined) {
        this.user.pwd1 = _pwd;
      }

      this.userService.login(this.user).subscribe(
        (data) => {
          this.user = { ...this.user, ...data };
          localStorage.setItem('user_name', this.user.name);
          localStorage.setItem('user_id', this.user._id);
          this.login = true;
          this.showSuccessAlert('Login as: ' + this.user.name, 'success');
        },
        (error) => {
          console.log(error.error.message);
          this.showSuccessAlert(error.error.message, 'danger');
        }
      );
    } else {
      //alert('Please fill in all required fields correctly.');
      this.showSuccessAlert('Please fill in all required fields correctly.        joputa', 'danger');
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

}
