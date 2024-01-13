import { Component, ViewChild } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from './payment.service';
import { ActivatedRoute } from '@angular/router';
import { Stripe } from "stripe-angular"
declare let Stripe: any;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent {

  @ViewChild('alert')
  alert!: NgbAlert;

  user: User = new User();
  messageAlert: string = '';
  showAlert: boolean = false;
  alertType: string = '';
  game: string = '';
  matchesToPay: number = 0;
  stripe = Stripe("pk_test_51LwRTaFL7cIrhy5dNs2ZH5LFzl1SkbtOxMerZoa6tpGMbrFr5wNAuMTJNFN1VkjRZkc6fVduS0hXTXWRUOrBB0l200D3vZWWnB")

  private _user_name: string = '';
  private _user_id: string = '';
  private _client_secret: string = '';

  constructor(private route: ActivatedRoute, private paymentsService: PaymentService, private userService: UserService, private router: Router, private http: HttpClient) {
  }

  ngOnInit(): void {
    if (localStorage != null) {
      const _user_name_ = localStorage.getItem("user_name");
      const _user_id_ = localStorage.getItem("user_id");
      const _client_secret_ = localStorage.getItem("client_secret");

      if (_user_name_) {
        this._user_name = _user_name_;
      }
      if (_user_id_) {
        this._user_id = _user_id_;
      }
      if (_client_secret_) {
        this._client_secret = _client_secret_;
      }
    }

    document.cookie = "id_user=" + this._user_id + "; expires=Thu, 01 Jan 2099 00:00:00 GMT; path=/";
    const headers = { 'Content-Type': 'application/json', 'Cookie': document.cookie };
    this.userService.getUser(this._user_id, headers).subscribe(
      (data) => {
        this.user = { ...this.user, ...data };
      },
      (error) => {
        this.showSuccessAlert(error.error.message, 'danger');
      }
    );

  }


  redirectGame() {
    window.location.href = "/" + this.game;
  }

  prepay() {

    if (this.matchesToPay <= 20 && this.matchesToPay > 0) {
      document.cookie = "id_user=" + this._user_id + "; expires=Thu, 01 Jan 2099 00:00:00 GMT; path=/";
      const headers = { 'Content-Type': 'application/json', 'Cookie': document.cookie };
      this.paymentsService.prepay(this.matchesToPay,headers).subscribe(
        (data) => {
          this._client_secret = data.client_secret;
          this.showForm();
        },
        (error) => {
          this.showSuccessAlert(error.error.message, 'danger');
        }
      );
    } else {
      this.showSuccessAlert('Not valid number of matches', 'danger');
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


  showForm() {
    let elements = this.stripe.elements()
    let style = {
      base: {
        color: "#32325d", fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased", fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      }, invalid: {
        fontFamily: 'Arial, sans-serif', color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
    let card = elements.create("card", { style: style })
    card.mount("#card-element")
    card.on("change", function (event: any) {
      document.querySelector("button")!.disabled = event.empty;
      document.querySelector("#card-error")!.textContent =
        event.error ? event.error.message : "";
    });
    let self = this;
    let form = document.getElementById("payment-form"); form!.addEventListener("submit", function (event) {
      event.preventDefault();
      self.payWithCard(card);
    });
    form!.style.display = "block"
  }

  payWithCard(card: any) {
    let self = this
    this.stripe.confirmCardPayment(this._client_secret, {
      payment_method: {
        card: card
      }
    }).then(function (response: any) {
      if (response.error) {
        alert(response.error.message);
      } else {
        if (response.paymentIntent.status === 'succeeded') {
          const button = document.getElementById("submit") as HTMLButtonElement | null;
          if (button) {
            button.disabled = true;
          }
          self.paymentsService.confirm().subscribe({
            next: (response: any) => {
              self.user.paidMatches += self.matchesToPay;
              localStorage.setItem("user_paidMatches", self.user.paidMatches.toString());
              self.showSuccessAlert('Successfull payment', 'info');
              setTimeout(() => {
                window.location.href = "/";
              }, 2000);

            },
            error: (response: any) => {
              self.showSuccessAlert('Error trying to confirm the payment', 'danger');
            }
          })
        }
      }
    });
  }
}
