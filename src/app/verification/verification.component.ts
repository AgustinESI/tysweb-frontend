import { Component } from '@angular/core';
import { UserService } from '../user-service';
import { HttpClient } from '@angular/common/http';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent {
  _user: User = new User();
  public validateEmail: boolean = false;
  private _paramId: string = '';

  constructor(private userService: UserService, private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this._paramId = params['id'];
    });

  }

  ngOnInit() {

    if (this._paramId) {
      this.userService.verification(this._paramId).subscribe(
        (data) => {
          this._user = { ...this._user, ...data };

          setTimeout(() => {
            localStorage.setItem('user_name', this._user.name);
            localStorage.setItem('user_id', this._user.id);
            localStorage.setItem('active', "true");
            this.validateEmail = true;
            window.location.href = "/";
          }, 5000);

        },
        (error) => {
          //this.showSuccessAlert(error.error.message, 'danger');
        }
      );
    }
  }

}
