import {Routes} from '@angular/router';
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";
import {LoginPageComponent} from "./shared/pages/login-page/login-page.component";
import {RegisterPageComponent} from "./shared/pages/register-page/register-page.component";
import {AuthGuard} from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent},
      {path: 'register', component: RegisterPageComponent}
    ]
  },
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      {
        path: 'overview',
        loadComponent: () => import('../app/shared/pages/overview-page/overview-page.component')
          .then(c => c.OverviewPageComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('../app/shared/pages/analytics-page/analytics-page.component')
          .then(c => c.AnalyticsPageComponent)
      },
      {
        path: 'history',
        loadComponent: () => import('../app/shared/pages/history-page/history-page.component')
          .then(c => c.HistoryPageComponent)
      },
      {
        path: 'order',
        loadChildren: () => import('../app/shared/pages/order-page/order.routes')
          .then(r => r.orderRoutes)
      },
      {
        path: 'categories',
        loadChildren: () => import('../app/shared/pages/categories-page/category.routes')
          .then(r => r.categoryRoutes)
      }
    ]
  }
];
