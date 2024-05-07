import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HistoryFilterComponent} from "./history-filter/history-filter.component";
import {HistoryListComponent} from "./history-list/history-list.component";
import {NgClass, NgIf} from "@angular/common";
import {MaterialInstance, MaterialService} from "../../helpers/material.service";
import {OrdersService} from "../../services/orders.service";
import {takeUntil} from "rxjs";
import {DestroySubscription} from "../../helpers/destroy-subscription";
import {Order} from "../../interfaces/order.interface";
import {LoaderComponent} from "../../components/loader/loader.component";
import {Filter} from "../../interfaces/filter.interface";

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [
    HistoryFilterComponent,
    HistoryListComponent,
    NgIf,
    NgClass,
    LoaderComponent
  ],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.scss'
})
export class HistoryPageComponent extends DestroySubscription implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('tooltip') tooltipRef!: ElementRef;
  tooltip!: MaterialInstance;
  isFilterVisible = false;
  loadingMore = false;
  reloading = false;
  allOrdersLoaded = false;
  orders: Order[] = [];
  filter: Filter = {};

  readonly STEP = 5;

  offset = 0;
  limit = this.STEP;

  constructor(private ordersService: OrdersService) {
    super();
  }

  ngOnInit(): void {
    this.reloading = true;
    this.fetch();
  }

  fetch() {
    // const params = {
    //   offset: this.offset,
    //   limit: this.limit
    // };
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
        limit: this.limit
    })
    this.ordersService.fetch(params).pipe(takeUntil(this.destroyStream$)).subscribe(response => {
      this.orders = this.orders.concat(response.orders);
      this.loadingMore = false;
      this.reloading = false;
      this.allOrdersLoaded = response.meta.totalCount <= this.orders.length;
    });
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  loadMore() {
    this.offset += this.STEP;
    this.loadingMore = true;
    this.fetch();
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.fetch();
  }

  override ngOnDestroy(): void {
    this.tooltip.destroy!();
  }
}
