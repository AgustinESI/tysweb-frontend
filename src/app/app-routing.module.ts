import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FourInLineComponent } from './four-in-line/four-in-line.component';
import { RegisterComponent } from './register/register.component';
import { AlertComponent } from './alert/alert.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { MastermindComponent } from './mastermind/mastermind.component';


const routes: Routes = [
  { path: '4inline', component: FourInLineComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'alert', component: AlertComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'mastermind', component: MastermindComponent},
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
