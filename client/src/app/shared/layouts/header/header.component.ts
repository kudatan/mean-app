import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgIf,
    NgForOf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy{
  BURGER_CLOSE_ANIMATION_TIME = 500;

  showBurger= false;
  showBurgerOpen = false;
  private authSubscription: Subscription;
  isAuthorized: boolean = this.authService.isAuthenticated();

  links = [
    {url: '/how-it-works', name: 'How it works'},
    {url: '/overview', name: 'Overview'},
    {url: '/analytics', name: 'Analytics'},
    {url: '/history', name: 'History'},
    {url: '/order', name: 'Add order'},
    {url: '/categories', name: 'Categories'}
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.authSubscription = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuthorized = isAuth;
    });
  }

  ngOnInit() {
    this.isAuthorized = this.authService.isAuthenticated();
  }


  openBurger() {
    this.showBurgerOpen = true;
    this.showBurger = true;
    document.getElementById('burger-icon')!.classList.toggle('burger-open');
  }


  closeBurger(e: Event) {
    this.showBurgerOpen = false;
    setTimeout(() => {
      this.showBurger = false;
    }, this.BURGER_CLOSE_ANIMATION_TIME);
    document.getElementById('burger-icon')!.classList.toggle('burger-open');
  }

  logout(event: Event) {
    event.preventDefault();
    this.closeBurger(event);

    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
