import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Chatbot } from '../chatbot/chatbot';

@Component({
  selector: 'app-main',
  imports: [Sidebar, Chatbot],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {}
