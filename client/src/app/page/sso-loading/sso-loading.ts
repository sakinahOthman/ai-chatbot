import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sso-loading',
  templateUrl: './sso-loading.html',
  styleUrl: './sso-loading.scss',
})
export class SsoLoading implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Simulate SSO loading time
    setTimeout(() => {
        
      this.router.navigate(['/main']);
    }, 3000); // 3 seconds loading
  }
}