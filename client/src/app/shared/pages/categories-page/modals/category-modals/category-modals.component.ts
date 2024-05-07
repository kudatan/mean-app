import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../../../../helpers/material.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {PositionsService} from "../../../../services/positions.service";
import {Position} from "../../../../interfaces/position.interface";
import {takeUntil} from "rxjs";
import {DestroySubscription} from "../../../../helpers/destroy-subscription";

@Component({
  selector: 'app-category-modals',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './category-modals.component.html',
  styleUrl: './category-modals.component.scss'
})
export class CategoryModalsComponent extends DestroySubscription implements OnInit, AfterViewInit {
  @Input() categoryId!: string;
  @Input() positions: Position[] = [];
  @Input() positionId: string | undefined = '';
  @Output() newPositionCreated: EventEmitter<Position> = new EventEmitter<Position>();
  @ViewChild('categoryModal') modalRef!: ElementRef;
  modal!: MaterialInstance;
  positionForm!: FormGroup;

  constructor(private positionsService: PositionsService) {
    super();
  }

  ngOnInit(): void {
    this.positionForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  openAddModal() {
    this.positionForm.reset({
      name: '',
      cost: 1
    });
    if (this.modal) {
      this.modal.open?.();
    }
    MaterialService.updateTextInputs();
  }

  openEditModal(selectedPosition: Position) {
    this.positionForm.patchValue({
      name: selectedPosition?.name,
      cost: selectedPosition?.cost
    });
    if (this.modal) {
      this.modal.open?.();
    }
    MaterialService.updateTextInputs();
  }

  onCancel() {
    if (this.modal) {
      this.modal.close?.();
    }
  }

  onSubmit() {
    this.positionForm.disable();

    const position: Position = {
      name: this.positionForm.value.name,
      cost: this.positionForm.value.cost,
      category: this.categoryId
    }

    if (this.positionId !== '') {
      position._id = this.positionId;
      this.positionsService.update(position).pipe(takeUntil(this.destroyStream$)).subscribe(
        newPosition => {
          MaterialService.toast('Position update');
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions[idx] = position
        },
        error => {
          this.positionForm.enable();
          MaterialService.toast(error.error.message)
        },
        () => {
          this.onCancel();
          this.positionForm.reset({name: '', cost: 1});
          this.positionForm.enable();
        }
      )
    } else {
      this.positionsService.create(position).pipe(takeUntil(this.destroyStream$)).subscribe(
        newPosition => {
          MaterialService.toast('Position created');
          this.newPositionCreated.emit(newPosition);
        },
        error => {
          this.positionForm.enable();
          MaterialService.toast(error.error.message)
        },
        () => {
          this.onCancel();
          this.positionForm.reset({name: '', cost: 1});
          this.positionForm.enable();
        }
      )
    }
  }
}
