import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddstockpopupComponent } from './addstockpopup.component';

describe('AddstockpopupComponent', () => {
  let component: AddstockpopupComponent;
  let fixture: ComponentFixture<AddstockpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddstockpopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddstockpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
