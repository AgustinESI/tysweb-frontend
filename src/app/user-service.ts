import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class UserService {

  //private baseURL = "http://192.168.18.42:8080/users/"
  private baseURL = "http://localhost:8080/users/"

  constructor(private httpClient: HttpClient) { }

  register(user: User): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post(this.baseURL + "register", user, { headers, withCredentials: true })
  }
  verification(id_user: String): Observable<any> {
    return this.httpClient.get(this.baseURL + "register/activate/" + id_user, { withCredentials: true })
  }

  login(content: User): Observable<any> {
    return this.httpClient.put(this.baseURL + "login", content, { withCredentials: true });
  }

  getUser(user_id: String): Observable<any> {
    return this.httpClient.get(this.baseURL + user_id, { withCredentials: true });
  }
  getUserImage(user_id: String): Observable<Blob> {
    return this.httpClient.get(this.baseURL + user_id + '/image', { responseType: 'blob' });
  }
}