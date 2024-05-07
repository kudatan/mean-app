import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../../../../helpers/material.service";
import {Order} from "../../../../interfaces/order.interface";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-history-modals',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './history-modals.component.html',
  styleUrl: './history-modals.component.scss'
})
export class HistoryModalsComponent implements AfterViewInit, OnDestroy{
  @ViewChild('modal') modalRef!: ElementRef;
  selectOrder!: Order;
  modal!: MaterialInstance;

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  openModal(order: Order) {
    if (this.modal) {
      this.modal.open?.();
    }
    this.selectOrder =  order;
    console.log(this.selectOrder)
  }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost
    }, 0);
  }

  cancel() {
    if (this.modal) {
      this.modal.close!();
    }
  }

  ngOnDestroy(): void {
    if (this.modal) {
      this.modal.destroy!();
    }
  }

}
