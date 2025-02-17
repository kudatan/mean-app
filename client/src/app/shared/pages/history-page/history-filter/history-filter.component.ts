import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild} from '@angular/core';
import {Filter} from "../../../interfaces/filter.interface";
import {FormsModule} from "@angular/forms";
import {filter} from "rxjs";
import {MaterialDatepicker, MaterialService} from "../../../helpers/material.service";

@Component({
  selector: 'app-history-filter',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './history-filter.component.html',
  styleUrl: './history-filter.component.scss'
})
export class HistoryFilterComponent implements AfterViewInit, OnDestroy{
  @Output() onFilter = new EventEmitter<Filter>;
  @ViewChild('start') startRef!: ElementRef;
  @ViewChild('end') endRef!: ElementRef;

  start!: MaterialDatepicker;
  end!: MaterialDatepicker;
  order!: number;

  isValid = true;
  constructor() {
  }

  submitFilter() {
    const filter: Filter = {};

    if (this.order) {
      filter.order = this.order;
    }

    if (this.start.date) {
      filter.start = this.start.date;
    }

    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.onFilter.emit(filter);
  }

  ngAfterViewInit(): void {
    this.start = MaterialService.initDatePicker(this.startRef, this.validate.bind(this));
    this.end = MaterialService.initDatePicker(this.endRef, this.validate.bind(this));
  }

  validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return;
    }

    this.isValid = this.start.date < this.end.date;
  }

  ngOnDestroy(): void {
    this.start.destroy!();
    this.end.destroy!();
  }
}
