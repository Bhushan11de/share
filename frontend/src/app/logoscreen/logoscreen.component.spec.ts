import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoscreenComponent } from './logoscreen.component';

describe('LogoscreenComponent', () => {
  let component: LogoscreenComponent;
  let fixture: ComponentFixture<LogoscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoscreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogoscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
