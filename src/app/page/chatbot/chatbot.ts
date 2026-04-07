import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  text: string;
  isUser: boolean;
}

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
})
export class Chatbot {
  userInput = '';
  messages: ChatMessage[] = [
    { text: 'Hello! I am your chatbot. Ask me anything.', isUser: false },
  ];

  sendMessage(): void {
    const trimmed = this.userInput.trim();
    if (!trimmed) {
      return;
    }

    this.messages.push({ text: trimmed, isUser: true });

    const botReply = this.generateBotReply(trimmed);
    this.messages.push({ text: botReply, isUser: false });

    this.userInput = '';

    setTimeout(() => this.scrollToLastMessage(), 0);
  }

  private generateBotReply(userText: string): string {
    // Simple static response logic for demo.
    if (userText.toLowerCase().includes('hello')) {
      return 'Hi there! How can I help you today?';
    }
    if (userText.toLowerCase().includes('help')) {
      return 'I can echo your message or answer basic questions like "hello".';
    }
    return `You said: "${userText}"`;
  }

  private scrollToLastMessage(): void {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}

