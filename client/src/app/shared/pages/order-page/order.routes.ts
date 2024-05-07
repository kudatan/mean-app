import {Routes} from "@angular/router";
import {OrderPageComponent} from "./order-page.component";
import {OrderCategoriesComponent} from "./order-categories/order-categories.component";
import {OrderPositionsComponent} from "./order-positions/order-positions.component";


export const orderRoutes: Routes = [
  {
    path: '',
    component: OrderPageComponent,
    children: [
      {
        path: '',
        component: OrderCategoriesComponent
      },
      {
        path: ':id',
        component: OrderPositionsComponent
      }
    ]
  }
];
