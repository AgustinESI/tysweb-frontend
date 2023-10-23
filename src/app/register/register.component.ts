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

  constructor(private userService: UserService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {

  }

  registerForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    pwd1: new FormControl(''),
    pwd2: new FormControl('')
  }
  )


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

      this.userService.register(this.user).subscribe(
        (data) => {
          this.user = { ...this.user, ...data };
          localStorage.setItem('user_name', this.user.name);
          localStorage.setItem('user_id', this.user._id);
          this.showSuccessAlert(this.user.name + ' is registred', 'success');
        },
        (error) => {
          console.log(error.error.message);
          if (error.error.message.includes('Duplicate entry')) {
            this.showSuccessAlert('User with name ' + this.user.email + ' already exists.', 'danger');
          } else {
            this.showSuccessAlert(error.error.message, 'danger');
          }
        }
      );
    } else {
      //alert('Please fill in all required fields correctly.');
      this.showSuccessAlert('Please fill in all required fields correctly.', 'danger');
    }
  }


  showSuccessAlert(_message: string, _type: string) {
    this.alertType = _type;
    this.messageAlert = _message;
    this.showAlert = true; // Show the success alert
    setTimeout(() => {
      this.showAlert = false;
      this.alert.close(); // Automatically hide the success alert after a certain duration (e.g., 5 seconds)
    }, 5000);

  }

}