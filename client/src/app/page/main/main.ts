import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Chatbot } from '../chatbot/chatbot';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, Sidebar, Chatbot],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {}
