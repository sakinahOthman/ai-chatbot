import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-faq',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {}
