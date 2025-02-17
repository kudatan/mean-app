import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPositionsComponent } from './order-positions.component';

describe('OrderPositionsComponent', () => {
  let component: OrderPositionsComponent;
  let fixture: ComponentFixture<OrderPositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPositionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
