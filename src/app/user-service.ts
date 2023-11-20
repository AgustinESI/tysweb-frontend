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

  getUser(user_id: String): Observable<any> {
    return this.httpClient.get(this.baseURL +  user_id, { withCredentials: true });
  }
  getUserImage(user_id: String): Observable<Blob> {
    return this.httpClient.get(this.baseURL +  user_id + '/image', { responseType: 'blob' });
  }
}