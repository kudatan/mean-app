import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../../../../helpers/material.service";
import {OrderService} from "../../../../../core/services/order.service";
import {NgForOf, NgIf} from "@angular/common";
import {Order, OrderPosition} from "../../../../interfaces/order.interface";
import {OrdersService} from "../../../../services/orders.service";
import {takeUntil} from "rxjs";
import {DestroySubscription} from "../../../../helpers/destroy-subscription";

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './order-modal.component.html',
  styleUrl: './order-modal.component.scss'
})
export class OrderModalComponent extends DestroySubscription implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild('modal') modalRef!: ElementRef;
  modal!: MaterialInstance;
  pending = false;

  constructor(public order: OrderService,
              private orderService: OrdersService) {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  openModal() {
    if (this.modal) {
      this.modal.open?.();
    }
  }

  cancel() {
    if (this.modal) {
      this.modal.close!();
    }
  }

  submit() {
    this.pending = true;

    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id
        return item
      })
    };

    this.orderService.create(order).pipe(takeUntil(this.destroyStream$)).subscribe(
      newOrder => {
        MaterialService.toast(`The order №${newOrder.order} has been added `);
        this.order.clear();
      },
      error => {MaterialService.toast(error.error.message)},
        () => {
          if (this.modal) {
            this.modal.close!();
          }
          this.pending = false;
        }
    );
  }

  removePosition(item: OrderPosition) {
    this.order.remove(item);
  }


  override ngOnDestroy(): void {
    if (this.modal) {
      this.modal.destroy!();
    }
  }
}
