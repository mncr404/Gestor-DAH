import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrimoniaHomeComponent } from './patrimonia-home.component';

describe('PatrimoniaHomeComponent', () => {
  let component: PatrimoniaHomeComponent;
  let fixture: ComponentFixture<PatrimoniaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatrimoniaHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatrimoniaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
