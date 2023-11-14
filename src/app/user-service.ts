import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class UserService {

  private baseURL = "http://localhost:8080/users/"

  constructor(private httpClient: HttpClient) { }

  register(user: User): Observable<any> {
    return this.httpClient.post(this.baseURL + "register", user, { withCredentials: true })
  }

  login(user: User): Observable<any> {
    return this.httpClient.put(this.baseURL + "login", user, { withCredentials: true });
  }
}