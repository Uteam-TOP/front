import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {UiButtonComponent} from "../../ui-components/ui-button/ui-button.component";
import {PopupComponent} from "../../../layers/popup/popup.component";

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [
    UiButtonComponent,
    MatDialogClose,
    PopupComponent
  ],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {text: string, title: string},
    public dialogRef: MatDialogRef<ConfirmModalComponent>,
  ) {}

  closePopupSuccess() {
    this.dialogRef.close();
  }
}
