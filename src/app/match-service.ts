import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movement } from './four-in-line/movement';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private baseURL = "http://localhost:8080/matches"

  constructor(private httpClient: HttpClient) { }

  startFourInLineGame(): Observable<any> {
    return this.httpClient.get(this.baseURL + "/4line/start", { withCredentials: true });
  }
  startMasterMindGame(): Observable<any>{
    return this.httpClient.get(this.baseURL + "/mastermind/start", {withCredentials: true});
  }

  getMatch(id_match: string): Observable<any> {
    return this.httpClient.get(this.baseURL + "/board/" + id_match, { withCredentials: true });
  }

  doMovement(movement: Movement): Observable<any> {
    return this.httpClient.post(this.baseURL + "/4line/add", movement, { withCredentials: true })
  }
  addColor(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); // Define el tipo de contenido como JSON
    return this.httpClient.post(this.baseURL + "/mastermind/add", data, { headers: headers, withCredentials: true });
  }



}
