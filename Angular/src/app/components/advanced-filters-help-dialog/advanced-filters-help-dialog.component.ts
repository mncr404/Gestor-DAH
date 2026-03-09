import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-advanced-filters-help-dialog',
  templateUrl: './advanced-filters-help-dialog.component.html',
  styleUrls: ['./advanced-filters-help-dialog.component.css']
})
export class AdvancedFiltersHelpDialogComponent {
  dontShowAgain = false;

  constructor(private ref: MatDialogRef<AdvancedFiltersHelpDialogComponent>) {}

  close() {
    this.ref.close({ dontShowAgain: this.dontShowAgain });
  }
}