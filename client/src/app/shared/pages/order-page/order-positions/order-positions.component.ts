import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PositionsService} from "../../../services/positions.service";
import {map, Observable, switchMap} from "rxjs";
import {Position} from "../../../interfaces/position.interface";
import {DestroySubscription} from "../../../helpers/destroy-subscription";
import {LoaderComponent} from "../../../components/loader/loader.component";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {OrderService} from "../../../../core/services/order.service";
import {MaterialService} from "../../../helpers/material.service";

@Component({
  selector: 'app-order-positions',
  standalone: true,
  imports: [
    LoaderComponent,
    NgIf,
    AsyncPipe,
    NgForOf,
    FormsModule
  ],
  templateUrl: './order-positions.component.html',
  styleUrl: './order-positions.component.scss'
})
export class OrderPositionsComponent extends DestroySubscription implements OnInit{
  positions$!: Observable<Position[]>
  constructor(private route: ActivatedRoute,
              private positionsService: PositionsService,
              private order: OrderService) {
    super();
  }

  ngOnInit(): void {
    this.positions$ = this.route.params
      .pipe(
      switchMap(
        (params: Params) => {
          return this.positionsService.fetch(params['id']);
        }
      ),
        map(
          (positions: Position[]) => {
            return positions.map(position => {
              position.quantity = 1;
              return position;
            })
          }
        )
    )
  }

  addToOrder(position: Position) {
    MaterialService.toast(`Add ${position.name} x${position.quantity}`);
    this.order.add(position);
  }
}
