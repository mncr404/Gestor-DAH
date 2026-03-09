import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonumentosFiltrosDrawerComponent } from './monumentos-filtros-drawer.component';

describe('MonumentosFiltrosDrawerComponent', () => {
  let component: MonumentosFiltrosDrawerComponent;
  let fixture: ComponentFixture<MonumentosFiltrosDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonumentosFiltrosDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonumentosFiltrosDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
