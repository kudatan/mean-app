import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {of, Subscription, switchMap} from "rxjs";
import {CategoriesService} from "../../../services/categories.service";
import {MaterialService} from "../../../helpers/material.service";
import {environment} from "../../../../../environments/environment";
import {Category} from "../../../interfaces/category.interface";
import {PositionsFormComponent} from "./positions-form/positions-form.component";

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    PositionsFormComponent
  ],
  templateUrl: './categories-form.component.html',
  styleUrl: './categories-form.component.scss'
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  @ViewChild('input') inputRef!: ElementRef;

  categoryForm!: FormGroup;
  category!: Category;
  image!: File;
  oldCategoryName: string | undefined;
  categoryId!: string | undefined;
  inputChange = false;
  imageChange = false;
  imagePreview: string | ArrayBuffer | null | undefined;
  isNew = true;
  apiUrl: string = environment.baseUrl;
  private routeParamsSubscription: Subscription | undefined;
  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.categoryForm.disabled;

    this.categoryForm.get('name')?.valueChanges.subscribe((value) => {
      this.onInputChange(value);
    });

    this.routeParamsSubscription = this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false;
              return this.categoriesService.getById(params['id']);
            }

            return of(null);
          }
        )
      )
      .subscribe(
        category => {
          if (category) {
            this.category = category;
            this.oldCategoryName = category.name;
            this.categoryForm.patchValue({
              name: category.name
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();

            this.categoryForm.enable();
            this.categoryId = category._id;
          }
        },
        error => MaterialService.toast(error.error.message)
      )
  }

  onInputChange(value: string): void {
    this.inputChange = value !== this.oldCategoryName;
  }


  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    const maxFileSizeInBytes = 4.5 * 1024 * 1024;

    if (file.size > maxFileSizeInBytes) {
      MaterialService.toast('File size exceeds the maximum limit of 4.5 MB');
      return;
    }

    if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
      this.image = file;

      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };

      this.imageChange = true;

      reader.readAsDataURL(this.image);
    } else {
      MaterialService.toast('We only support png, jpeg, and jpg formats');
    }
  }

  onSubmit() {
    let obs$
    this.categoryForm.disable();
    if (this.isNew) {
      obs$ = this.categoriesService.create(this.categoryForm.value.name, this.image);
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.categoryForm.value.name, this.image);
    }

    obs$.subscribe(
      category => {
        this.category = category;
        MaterialService.toast('Changes save');
        this.router.navigate(['/categories'])
        this.categoryForm.enable();
      },
      error => {
        MaterialService.toast(error.error.message);
        this.categoryForm.enable();
      }
    )
  }

  deleteCategory() {
    const decision = window.confirm(`are you sure you want to delete the category "${this.category.name}"`);

    if (decision && this.category._id) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }

  ngOnDestroy(): void {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
  }
}
