import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryModalsComponent } from './history-modals.component';

describe('HistoryModalsComponent', () => {
  let component: HistoryModalsComponent;
  let fixture: ComponentFixture<HistoryModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryModalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
