import {Component, Input, ViewChild} from '@angular/core';
import {HistoryModalsComponent} from "../modals/history-modals/history-modals.component";
import {Order} from "../../../interfaces/order.interface";
import {DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [
    HistoryModalsComponent,
    NgForOf,
    DatePipe
  ],
  templateUrl: './history-list.component.html',
  styleUrl: './history-list.component.scss'
})
export class HistoryListComponent {
  @Input() orders!: Order[];
  @ViewChild(HistoryModalsComponent) historyModalComponent!: HistoryModalsComponent;

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost
    }, 0);
  }

  openModal(order: Order) {
    this.historyModalComponent.openModal(order);
  }
}
