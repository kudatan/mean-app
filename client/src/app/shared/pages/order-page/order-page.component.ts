import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {takeUntil} from "rxjs";
import {DestroySubscription} from "../../helpers/destroy-subscription";
import {OrderModalComponent} from "./modals/order-modal/order-modal.component";
import {OrderService} from "../../../core/services/order.service";

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgIf,
    OrderModalComponent
  ],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss'
})
export class OrderPageComponent extends DestroySubscription implements OnInit {
  @ViewChild(OrderModalComponent) orderModalComponent!: OrderModalComponent;
  isRoot!: boolean;

  constructor(private router: Router, public order: OrderService) {
    super();
  }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order';
    this.router.events.pipe(takeUntil(this.destroyStream$)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  openModal() {
    this.orderModalComponent.openModal();
  }
}
