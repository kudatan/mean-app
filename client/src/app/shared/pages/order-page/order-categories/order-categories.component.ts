import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../../../services/categories.service";
import {Observable} from "rxjs";
import {Category} from "../../../interfaces/category.interface";
import {LoaderComponent} from "../../../components/loader/loader.component";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {environment} from "../../../../../environments/environment";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-order-categories',
  standalone: true,
  imports: [
    LoaderComponent,
    NgIf,
    AsyncPipe,
    NgForOf,
    RouterLink
  ],
  templateUrl: './order-categories.component.html',
  styleUrl: './order-categories.component.scss'
})
export class OrderCategoriesComponent implements OnInit {
  apiUrl: string = environment.baseUrl;
  categories$!: Observable<Category[]>;
  constructor(private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    this.categories$ = this.categoriesService.fetch();
  }

}
