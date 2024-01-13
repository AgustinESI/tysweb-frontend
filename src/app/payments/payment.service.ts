import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {


  private baseURL = "http://localhost:8080/payments"
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  prepay(matches: number, headers: any): Observable<any> {
    return this.httpClient.get(this.baseURL + "/prepay/"+matches, { headers: headers, withCredentials: true });
  }

  confirm(): Observable<any> {
    return this.httpClient.get(this.baseURL + "/confirm", { headers: this.headers, withCredentials: true });
  }

}
