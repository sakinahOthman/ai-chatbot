import { Routes } from '@angular/router';
import { Main } from './page/main/main';
import { Chatbot } from './page/chatbot/chatbot';
import { About } from './page/about/about';
import { Faq } from './page/faq/faq';
import { Pricing } from './page/pricing/pricing';
import { SsoLoading } from './page/sso-loading/sso-loading';

export const routes: Routes = [
  { path: '', component: SsoLoading },
  { path: 'main', component: Main },
  { path: 'chatbot', component: Chatbot, outlet: 'sidebar' },
  { path: 'about', component: About, outlet: 'sidebar' },
  { path: 'faq', component: Faq, outlet: 'sidebar' },
  { path: 'pricing', component: Pricing, outlet: 'sidebar' },
];