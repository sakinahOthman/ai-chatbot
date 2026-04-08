import { Routes } from '@angular/router';
import { Main } from './page/main/main';
import { Chatbot } from './page/chatbot/chatbot';
import { About } from './page/about/about';
import { Faq } from './page/faq/faq';
import { Pricing } from './page/pricing/pricing';

export const routes: Routes = [
  { path: 'chatbot', component: Chatbot },
  { path: 'about', component: About },
  { path: 'faq', component: Faq },
  { path: 'pricing', component: Pricing },
  { path: '', redirectTo: 'chatbot', pathMatch: 'full' },
];