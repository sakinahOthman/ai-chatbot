import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private url = 'http://localhost:3000/api/chats';

  sendMessage(userMessage: string) {
    return fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage }),
    }).then(res => res.json());
  }


}
