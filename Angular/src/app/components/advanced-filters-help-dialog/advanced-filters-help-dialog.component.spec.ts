import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFiltersHelpDialogComponent } from './advanced-filters-help-dialog.component';

describe('AdvancedFiltersHelpDialogComponent', () => {
  let component: AdvancedFiltersHelpDialogComponent;
  let fixture: ComponentFixture<AdvancedFiltersHelpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFiltersHelpDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedFiltersHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
