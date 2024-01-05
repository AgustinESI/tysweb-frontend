import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('alert')
  alert!: NgbAlert;

  user: User = new User();
  messageAlert: string = '';
  showAlert: boolean = false;
  alertType: string = '';
  private _lon: string = '';
  private _lat: string = '';


  constructor(private userService: UserService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.getLocation();
  }

  registerForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    pwd1: new FormControl(''),
    pwd2: new FormControl('')
  }
  )

  
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this._lat = position.coords.latitude.toString();
          this._lon = position.coords.longitude.toString();
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.showSuccessAlert('User denied the request for Geolocation.', 'danger');
              break;
            case error.POSITION_UNAVAILABLE:
              this.showSuccessAlert('Location information is unavailable.', 'danger');
              break;
            case error.TIMEOUT:
              this.showSuccessAlert('The request to get user location timed out.', 'danger');
              break;
          }
        }
      );
    } else {
      this.showSuccessAlert('Geolocation is not supported by this browser.', 'danger');
    }
  }

  doRegister() {
    if (this.registerForm.valid) {
      const nameValue = this.registerForm.get('name')?.value;
      const emailValue = this.registerForm.get('email')?.value;
      const pwd1Value = this.registerForm.get('pwd1')?.value;
      const pwd2Value = this.registerForm.get('pwd2')?.value;

      if (nameValue !== null && nameValue !== undefined) {
        this.user.name = nameValue;
      }
      if (emailValue !== null && emailValue !== undefined) {
        this.user.email = emailValue;
      }
      if (pwd1Value !== null && pwd1Value !== undefined) {
        this.user.pwd1 = pwd1Value;
      }
      if (pwd2Value !== null && pwd2Value !== undefined) {
        this.user.pwd2 = pwd2Value;
      }
      
      this.user.lat = this._lat;
      this.user.lon = this._lon;

      this.userService.register(this.user).subscribe(
        (data) => {
          this.user = { ...this.user, ...data };
          localStorage.setItem('active', "false");
          this.showSuccessAlert(this.user.name + ', please check your email', 'primary');
          if (this.user.active) {
            localStorage.setItem('user_name', this.user.name);
            localStorage.setItem('user_id', this.user.id);
            localStorage.setItem('user_img',this.user.image);
            window.location.href = "/"
          }
        },
        (error) => {
          if (error && error.error && error.error.message){
            if (error.error.message.includes('Duplicate entry')) {
              this.showSuccessAlert('User with name ' + this.user.email + ' already exists.', 'danger');
            } else {
              this.showSuccessAlert(error.error.message, 'danger');
            }
          }else{
            this.showSuccessAlert('Error:' + error.error.message, 'danger');
          }
        }
      );
    } else {
      this.showSuccessAlert('Please fill in all required fields correctly.', 'danger');
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