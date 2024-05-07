import {AfterViewInit, ChangeDetectorRef, Component,  Input, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../../services/positions.service";
import {takeUntil} from "rxjs";
import {DestroySubscription} from "../../../../helpers/destroy-subscription";
import {Position} from "../../../../interfaces/position.interface";
import {NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "../../../../components/loader/loader.component";
import {CategoryModalsComponent} from "../../modals/category-modals/category-modals.component";
import {MaterialService} from "../../../../helpers/material.service";

@Component({
  selector: 'app-positions-form',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    LoaderComponent,
    CategoryModalsComponent
  ],
  templateUrl: './positions-form.component.html',
  styleUrl: './positions-form.component.scss'
})
export class PositionsFormComponent extends DestroySubscription implements OnInit, AfterViewInit{
  @Input('categoryId') categoryId!: string;
  @ViewChild(CategoryModalsComponent) categoryModalsComponent!: CategoryModalsComponent;
  positions: Position[] = [];
  positionId: string | undefined = '';
  selectedPosition: Position | null = null;
  loading = false;

  constructor(private positionsService: PositionsService, private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.positionsService.fetch(this.categoryId).pipe(takeUntil(this.destroyStream$)).subscribe(
      positions => {
        this.positions = positions;
        this.loading = false;
      }
    );
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.selectedPosition = position;
    if (CategoryModalsComponent) {
      this.categoryModalsComponent.openEditModal(this.selectedPosition);
    }
  }

  ngAfterViewInit(): void {
  }

  onAddPosition() {
    this.positionId = '';
    if (CategoryModalsComponent) {
      this.categoryModalsComponent.openAddModal();
    }
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Are you sure you want to delete the position "${position.name}"`);

    if (decision) {
      this.positionsService.delete(position).pipe(takeUntil(this.destroyStream$)).subscribe(
        response => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions.splice(idx, 1);
          MaterialService.toast(response.message);
        },
        error => {
          MaterialService.toast(error.error.message)
        }
      )
    }
  }

  onNewPositionCreated(response: any) {
    const newPosition = response.position;
    this.positions.push(newPosition);
    this.cdr.detectChanges();
  }
}
