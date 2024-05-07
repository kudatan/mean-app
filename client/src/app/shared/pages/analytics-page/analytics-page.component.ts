import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../../services/analytics.service";
import {AnalyticsPage} from "../../interfaces/analytics.interface";
import {takeUntil} from "rxjs";
import {DestroySubscription} from "../../helpers/destroy-subscription";
import {LoaderComponent} from "../../components/loader/loader.component";
import {NgIf} from "@angular/common";
import {
  CategoryScale,
  Chart,
  ChartConfiguration,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title
} from "chart.js";

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    LoaderComponent,
    NgIf
  ],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss'
})
export class AnalyticsPageComponent extends DestroySubscription implements OnInit, AfterViewInit{
  @ViewChild('gain') gainRef!: ElementRef;
  @ViewChild('order') orderRef!: ElementRef;

  average!: number;
  pending = true;

  constructor(private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.analyticsService.getAnalytics().pipe(takeUntil(this.destroyStream$)).subscribe((data: AnalyticsPage) => {
      this.average = data.average;

      const gainConfig:IConfig = {
        label: 'Revenue',
        color: 'rgb(255,99,132)',
        labels: data.chart.map(x => {
          return x.label
        }),
        data : data.chart.map(y => {
          return  y.gain
        })
      }

      const orderConfig:IConfig = {
        label: 'Orders',
        color: 'rgb(54,162,235)',
        labels: data.chart.map(x => {
          return x.label
        }),
        data : data.chart.map(y => {
          return  y.order
        })
      }

      const gainCtx = this.gainRef.nativeElement.getContext('2d');
      gainCtx.canvas.height = '300px';

      const orderCtx = this.orderRef.nativeElement.getContext('2d');
      orderCtx.canvas.height = '300px';

      Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
      new Chart(gainCtx, createChartConfig(gainConfig));
      new Chart(orderCtx, createChartConfig(orderConfig));


      this.pending = false;
    })
  }
}

function createChartConfig(config:IConfig):ChartConfiguration {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels: config.labels,
      datasets: [
        {
          label: config.label,
          data: config.data,
          borderColor: config.color,
          stepped: false,
          fill: false
        }
      ]
    }
  }
}

interface IConfig {
  labels:string[],
  data:number[],
  label:string,
  color:string
}
