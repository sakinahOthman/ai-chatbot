import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api-service';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
})
export class Chatbot {
  private apiService = inject(ApiService);
  userInput = '';
  messages: ChatMessage[] = [
    { text: 'Hello! I am your chatbot. Ask me anything.', isUser: false, timestamp: new Date() },
  ];

  async sendMessage(): Promise<void> {
    const trimmed = this.userInput.trim();
    if (!trimmed) {
      return;
    }

    this.messages.push({ text: trimmed, isUser: true, timestamp: new Date() });

    const botReply = await this.generateBotReply(trimmed);
    this.messages.push({ text: botReply, isUser: false, timestamp: new Date() });

    this.userInput = '';

    setTimeout(() => this.scrollToLastMessage(), 0);
  }

  private generateBotReply(userText: string): Promise<string> {

    this.apiService.sendMessage(userText).then(response => {
      return Promise.resolve(response["reply"]);
      // Here you would typically update the messages with the AI's response
    }).catch(error => {
      console.error('Error communicating with API:', error);
      return Promise.resolve("Sorry, I encountered an error while processing your request.");
    });
    return Promise.resolve("Thinking...");
  }

  private scrollToLastMessage(): void {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}

