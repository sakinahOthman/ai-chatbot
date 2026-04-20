import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PageSelectorService, PageType } from '../../service/page-selector.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private pageSelectorService = inject(PageSelectorService);
  isActive: boolean = true;

  selectPage(page: PageType): void {
    this.isActive = true;
    this.pageSelectorService.selectPage(page);
  }
}
