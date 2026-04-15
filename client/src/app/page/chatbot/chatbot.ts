import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api-service';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
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
    { text: 'Hello! I am your chatbot. Ask me anything.', isUser: false, timestamp: new Date(), isLoading: false },
  ];

  sendMessage() {
    const trimmed = this.userInput.trim();
    if (!trimmed) {
      return;
    }

    this.addMessage(trimmed, true);
    this.generateBotReply(trimmed);
    this.userInput = '';
  }

  private generateBotReply(userText: string) {
    this.addMessage("", false, true);
    this.apiService.sendMessage(userText).subscribe({
      next: (response) => {
        const formattedText: string = response["reply"].replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        this.messages[this.messages.length - 1].text = formattedText;
        this.messages[this.messages.length - 1].isLoading = false;
        setTimeout(() => this.scrollToLastMessage(), 0);
      },
      error: (err) => {
        console.error('Request failed:', err);
        this.messages[this.messages.length - 1].text = "Sorry, I encountered an error while processing your request.";
        this.messages[this.messages.length - 1].isLoading = false;
        setTimeout(() => this.scrollToLastMessage(), 0);
      }
    });
  }

  private scrollToLastMessage(): void {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  addMessage(text: string, isUser: boolean, isLoading: boolean = false) {
    this.messages.push({ text, isUser, timestamp: new Date(), isLoading });
    setTimeout(() => this.scrollToLastMessage(), 0);
  }

  get groupedMessages() {
    const groups: { date: Date, messages: ChatMessage[] }[] = [];
    const map = new Map<string, ChatMessage[]>();

    for (const message of this.messages) {
      const dateKey = message.timestamp.toDateString();
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(message);
    }

    for (const [dateKey, msgs] of map) {
      groups.push({ date: new Date(dateKey), messages: msgs });
    }

    return groups;
  }
}

