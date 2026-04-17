import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  start: string;
  end: string;
  description?: string;
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar implements OnInit {
  viewMode: 'day' | 'week' = 'week';
  currentDate = new Date();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  weekDates: Date[] = [];
  dayEventsList: CalendarEvent[] = [];
  weekEventsList: CalendarEvent[] = [];
  timeSlots: string[] = [];

  // Sample events - you can replace with data from API
  sampleEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(),
      start: '10:00',
      end: '11:00',
      description: 'Weekly team sync'
    },
    {
      id: '2',
      title: 'Project Review',
      date: new Date(),
      start: '14:00',
      end: '15:00',
      description: 'Q2 project status'
    }
  ];

  ngOnInit() {
    this.generateTimeSlots();
    this.updateWeekDates();
    this.updateEventsList();
  }

  generateTimeSlots() {
    this.timeSlots = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      this.timeSlots.push(`${hour}:00`);
    }
  }

  updateWeekDates() {
    const current = new Date(this.currentDate);
    const first = current.getDate() - current.getDay();
    this.weekDates = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(current.setDate(first + i));
      this.weekDates.push(new Date(date));
    }
  }

  updateEventsList() {
    if (this.viewMode === 'day') {
      this.dayEventsList = this.sampleEvents.filter(
        event => this.isSameDay(event.date, this.currentDate)
      );
    } else {
      this.weekEventsList = this.sampleEvents.filter(
        event => this.isInWeek(event.date, this.weekDates)
      );
    }
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  isInWeek(date: Date, weekDates: Date[]): boolean {
    return weekDates.some(d => this.isSameDay(date, d));
  }

  getEventForTimeSlot(timeSlot: string, date: Date): CalendarEvent | undefined {
    const events = this.viewMode === 'day' ? this.dayEventsList : this.weekEventsList;
    return events.find(
      event => event.start === timeSlot && this.isSameDay(event.date, date)
    );
  }

  switchView(mode: 'day' | 'week') {
    this.viewMode = mode;
    this.updateEventsList();
  }

  goToPreviousDay() {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.currentDate = new Date(this.currentDate);
    this.updateWeekDates();
    this.updateEventsList();
  }

  goToNextDay() {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.currentDate = new Date(this.currentDate);
    this.updateWeekDates();
    this.updateEventsList();
  }

  goToToday() {
    this.currentDate = new Date();
    this.updateWeekDates();
    this.updateEventsList();
  }

  formatDate(date: Date): string {
    return `${this.monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  getCurrentDateDisplay(): string {
    return this.formatDate(this.currentDate);
  }

  addEvent(event: CalendarEvent) {
    this.sampleEvents.push(event);
    this.updateEventsList();
  }
}
