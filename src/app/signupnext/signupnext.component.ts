import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddstockpopupComponent } from './addstockpopup/addstockpopup.component';

@Component({
  selector: 'app-signupnext',
  standalone: true,
  imports: [],
  templateUrl: './signupnext.component.html',
  styleUrl: './signupnext.component.scss',
})
export class SignupnextComponent {
  constructor(private dialog: MatDialog) {}

  openAddStockPopup() {
    const dialogRef = this.dialog.open(AddstockpopupComponent, {
      width: '50vw',
      height: '60vh',
      panelClass: 'center-dialog',
    });
  }
}
