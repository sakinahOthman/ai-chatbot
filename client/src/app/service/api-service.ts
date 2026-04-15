import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient) {}

  private url = 'http://localhost:3000/api/chats';

  // sendMessage(userMessage: string) {
  //   return fetch(this.url, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ userMessage }),
  //   }).then(res => res.json());
  // }

  sendMessage(userMessage: string): Observable<any> {
    return this.http.post(this.url, JSON.stringify({ userMessage }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
