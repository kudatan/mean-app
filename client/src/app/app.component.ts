import {Component, OnInit} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {CommonModule} from "@angular/common";
import {LoginPageComponent} from "./shared/pages/login-page/login-page.component";
import {AuthService} from "./shared/services/auth.service";
import {HeaderComponent} from "./shared/layouts/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoginPageComponent, RouterModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService) {
  }
  title = 'client';

  ngOnInit(): void {
    const potentialToken = localStorage.getItem('auth-token');

    if (potentialToken !== null) {
      this.authService.setToken(potentialToken);
    }
  }
}
