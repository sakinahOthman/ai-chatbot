import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarDayViewComponent, CalendarEvent, CalendarWeekViewComponent, DateAdapter, provideCalendar} from 'angular-calendar';
import { ApiService, BabyScheduleEvent, BabyScheduleRequest, BabyScheduleResponse } from '../../service/api-service';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

type CalendarViewMode = 'day' | 'week';
type BabyEventType = 'nap' | 'feed' | 'play' | 'awake' | 'solids' | 'bedtime' | 'other';

interface BabyCalendarMeta {
  type: BabyEventType;
  notes?: string;
  source: 'ai' | 'manual';
}

type BabyCalendarEvent = CalendarEvent<BabyCalendarMeta>;

interface CustomEventForm {
  title: string;
  type: BabyEventType;
  startTime: string;
  endTime: string;
  notes: string;
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FormsModule, CalendarDayViewComponent, CalendarWeekViewComponent],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
   providers: [
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
})
export class Calendar {
  private apiService = inject(ApiService);
  readonly eventTypes: BabyEventType[] = ['nap', 'feed', 'play', 'awake', 'solids', 'bedtime', 'other'];

  view: CalendarViewMode = 'day';
  viewDate = new Date();
  events: BabyCalendarEvent[] = [];
  isGenerating = false;
  errorMessage = '';
  scheduleSummary = '';

  scheduleRequest: BabyScheduleRequest = {
    babyAgeMonths: 6,
    wakeTime: '07:00',
    bedtime: '19:00',
    naps: 3,
    feeds: 5,
    solids: false,
    notes: '',
    date: this.toDateInputValue(new Date()),
  };

  customEvent: CustomEventForm = {
    title: '',
    type: 'play',
    startTime: '10:00',
    endTime: '10:45',
    notes: '',
  };

  readonly colorMap: Record<BabyEventType, { primary: string; secondary: string }> = {
    nap: { primary: '#86c9b0', secondary: '#e7f7f2' },
    feed: { primary: '#d4994b', secondary: '#fff3df' },
    play: { primary: '#4f8ccf', secondary: '#eaf2fc' },
    awake: { primary: '#818cf8', secondary: '#eef0ff' },
    solids: { primary: '#ed7c4a', secondary: '#ffefe7' },
    bedtime: { primary: '#7c3aed', secondary: '#f5efff' },
    other: { primary: '#6b7280', secondary: '#f3f4f6' },
  };

  setView(view: CalendarViewMode): void {
    this.view = view;
  }

  moveDate(direction: 'prev' | 'next'): void {
    const baseDate = new Date(this.viewDate);
    if (this.view === 'day') {
      baseDate.setDate(baseDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      baseDate.setDate(baseDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    this.viewDate = baseDate;
    this.scheduleRequest.date = this.toDateInputValue(baseDate);
  }

  jumpToToday(): void {
    this.viewDate = new Date();
    this.scheduleRequest.date = this.toDateInputValue(this.viewDate);
  }

  onDateChange(dateValue: string): void {
    this.scheduleRequest.date = dateValue;
    this.viewDate = new Date(`${dateValue}T00:00:00`);
  }

  generateSchedule(): void {
    if (this.isGenerating) {
      return;
    }
    this.errorMessage = '';
    this.scheduleSummary = '';
    this.isGenerating = true;

    this.apiService.generateBabySchedule(this.scheduleRequest).subscribe({
      next: (response: BabyScheduleResponse) => {
        this.scheduleSummary = response.scheduleSummary ?? '';
        this.events = (response.events ?? []).map((event) => this.mapScheduleEvent(event));
        this.sortEvents();
        this.isGenerating = false;
      },
      error: () => {
        this.errorMessage = 'Unable to generate schedule right now. Please try again.';
        this.isGenerating = false;
      },
    });
  }

  addCustomEvent(): void {
    const title = this.customEvent.title.trim();
    if (!title) {
      return;
    }

    const dateBase = this.getSelectedDate();
    const normalizedType = this.normalizeType(this.customEvent.type);

    this.events = [
      ...this.events,
      {
        title,
        start: this.toDateTime(dateBase, this.customEvent.startTime),
        end: this.toDateTime(dateBase, this.customEvent.endTime),
        color: this.colorMap[normalizedType],
        meta: {
          type: normalizedType,
          notes: this.customEvent.notes.trim() || undefined,
          source: 'manual',
        },
      },
    ];

    this.sortEvents();
    this.customEvent = {
      title: '',
      type: 'play',
      startTime: '10:00',
      endTime: '10:45',
      notes: '',
    };
  }

  removeEvent(event: BabyCalendarEvent): void {
    this.events = this.events.filter((calendarEvent) => calendarEvent !== event);
  }

  protected formatTypeLabel(type: string): string {
    const normalized = this.normalizeType(type);
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  private mapScheduleEvent(event: BabyScheduleEvent): BabyCalendarEvent {
    const type = this.normalizeType(event.type);
    const baseDate = this.getSelectedDate();
    return {
      title: event.title || this.formatTypeLabel(type),
      start: this.toDateTime(baseDate, event.startTime),
      end: this.toDateTime(baseDate, event.endTime),
      color: this.colorMap[type],
      meta: {
        type,
        notes: event.notes,
        source: 'ai',
      },
    };
  }

  private normalizeType(value: string): BabyEventType {
    const normalized = (value || '').toLowerCase().trim();
    if (this.eventTypes.includes(normalized as BabyEventType)) {
      return normalized as BabyEventType;
    }
    return 'other';
  }

  private getSelectedDate(): Date {
    return new Date(`${this.scheduleRequest.date}T00:00:00`);
  }

  private sortEvents(): void {
    this.events = [...this.events].sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  private toDateTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map((part) => Number(part));
    const dateTime = new Date(date);
    dateTime.setHours(Number.isFinite(hours) ? hours : 0, Number.isFinite(minutes) ? minutes : 0, 0, 0);
    return dateTime;
  }

  private toDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
