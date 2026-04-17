import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
export interface BabyScheduleRequest {
  babyAgeMonths: number;
  wakeTime: string;
  bedtime: string;
  naps: number;
  feeds: number;
  solids: boolean;
  notes: string;
  date: string;
}

export interface BabyScheduleEvent {
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface BabyScheduleResponse {
  scheduleSummary?: string;
  events: BabyScheduleEvent[];
}

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

  generateBabySchedule(payload: BabyScheduleRequest): Observable<BabyScheduleResponse> {
    return this.http.post<BabyScheduleResponse>(`${this.url}/schedule`, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
