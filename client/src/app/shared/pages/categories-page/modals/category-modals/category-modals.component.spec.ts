import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryModalsComponent } from './category-modals.component';

describe('CategoryModalsComponent', () => {
  let component: CategoryModalsComponent;
  let fixture: ComponentFixture<CategoryModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryModalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
