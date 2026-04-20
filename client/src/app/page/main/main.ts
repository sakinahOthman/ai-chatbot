import { Component, OnInit, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Chatbot } from '../chatbot/chatbot';
import { About } from '../about/about';
import { Calendar } from '../calendar/calendar';
import { Faq } from '../faq/faq';
import { Pricing } from '../pricing/pricing';
import { CommonModule } from '@angular/common';
import { PageSelectorService, PageType } from '../../service/page-selector.service';

@Component({
  selector: 'app-main',
  imports: [CommonModule, Sidebar, Chatbot, About, Calendar, Faq, Pricing],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {
  private pageSelectorService = inject(PageSelectorService);

  selectedPage: PageType = 'chat';

  ngOnInit(): void {
    this.pageSelectorService.selectedPage$.subscribe((page) => {
      this.selectedPage = page;
    });
  }
}
