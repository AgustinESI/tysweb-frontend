import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FourInLineComponent } from './four-in-line/four-in-line.component';
import { RegisterComponent } from './register/register.component';
import { AlertComponent } from './alert/alert.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: 'games', component: FourInLineComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'alert', component: AlertComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
