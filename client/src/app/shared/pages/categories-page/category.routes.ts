import {Routes} from "@angular/router";
import {CategoriesPageComponent} from "./categories-page.component";
import {CategoriesFormComponent} from "./categories-form/categories-form.component";

export const categoryRoutes: Routes = [
  {
    path: '',
    component: CategoriesPageComponent
  },
  {
    path: 'new',
    component: CategoriesFormComponent
  },
  {
    path: ':id',
    component: CategoriesFormComponent
  }
];
