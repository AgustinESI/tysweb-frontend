import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FourInLineComponent } from './four-in-line/four-in-line.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from './alert/alert.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { MastermindComponent } from './mastermind/mastermind.component';
import { VerificationComponent } from './verification/verification.component';
import { PaymentsComponent } from './payments/payments.component';
import { ModalComponent } from './modal/modal.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    FourInLineComponent,
    RegisterComponent,
    NavBarComponent,
    FooterComponent,
    AlertComponent,
    LoginComponent,
    ChatComponent,
    HomeComponent,
    MastermindComponent,
    VerificationComponent,
    PaymentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModalModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FormsModule
  ],
  entryComponents: [ModalComponent]
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
