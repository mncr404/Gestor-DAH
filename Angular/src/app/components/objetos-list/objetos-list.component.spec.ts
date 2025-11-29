import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetosListComponent } from './objetos-list.component';

describe('ObjetosListComponent', () => {
  let component: ObjetosListComponent;
  let fixture: ComponentFixture<ObjetosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjetosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
