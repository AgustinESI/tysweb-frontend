import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movement } from './four-in-line/movement';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  //private baseURL = "http://192.168.18.42:8080/matches"
  private baseURL = "http://localhost:8080/matches"
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  start(type_game: string): Observable<any> {
    return this.httpClient.get(this.baseURL + "/start/" + type_game, { headers: this.headers, withCredentials: true });
  }

  getMatch(id_match: string): Observable<any> {
    return this.httpClient.get(this.baseURL + "/board/" + id_match, { headers: this.headers, withCredentials: true });
  }

  add(data: any): Observable<any> {
    return this.httpClient.post(this.baseURL + "/add", data, { headers: this.headers, withCredentials: true })
  }


}
