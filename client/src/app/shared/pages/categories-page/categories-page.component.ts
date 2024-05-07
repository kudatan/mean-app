import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {CategoriesService} from "../../services/categories.service";
import {LoaderComponent} from "../../components/loader/loader.component";
import {Category} from "../../interfaces/category.interface";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable} from "rxjs";
import {DestroySubscription} from "../../helpers/destroy-subscription";

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    RouterLink,
    LoaderComponent,
    NgIf,
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss'
})
export class CategoriesPageComponent implements OnInit{
  categories$!: Observable<Category[]>;
  constructor(private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    this.categories$ = this.categoriesService.fetch();
  }

}
