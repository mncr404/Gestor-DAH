import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaObjetosComponent } from './ficha-objetos.component';

describe('FichaObjetosComponent', () => {
  let component: FichaObjetosComponent;
  let fixture: ComponentFixture<FichaObjetosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaObjetosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaObjetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
