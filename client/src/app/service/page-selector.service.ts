import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type PageType = 'chat' | 'about' | 'calendar' | 'faq' | 'pricing';

@Injectable({
  providedIn: 'root',
})
export class PageSelectorService {
  private selectedPageSubject = new BehaviorSubject<PageType>('chat');
  public selectedPage$: Observable<PageType> = this.selectedPageSubject.asObservable();

  selectPage(page: PageType): void {
    this.selectedPageSubject.next(page);
  }

  getCurrentPage(): PageType {
    return this.selectedPageSubject.value;
  }
}
