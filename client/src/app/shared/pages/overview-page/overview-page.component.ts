import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../../services/analytics.service";
import {Observable} from "rxjs";
import {OverviewPage} from "../../interfaces/analytics.interface";
import {AsyncPipe, DatePipe, NgClass, NgIf} from "@angular/common";
import {LoaderComponent} from "../../components/loader/loader.component";
import {MaterialInstance, MaterialService} from "../../helpers/material.service";

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    LoaderComponent,
    NgClass,
    DatePipe
  ],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss'
})
export class OverviewPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tapTarget') tapTargetRef!: ElementRef;
  tapTarget!: MaterialInstance;
  yesterday = new Date();
  data$!: Observable<OverviewPage>

  constructor(private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.data$ = this.analyticsService.getOverview();

    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  openInfo() {
    this.tapTarget.open!();
  }

  ngOnDestroy(): void {
    this.tapTarget.destroy!();
  }
}
