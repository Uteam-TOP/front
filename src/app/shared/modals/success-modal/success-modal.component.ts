import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IHackathonDto} from "../../../core/models/hackathonDto";
import {UiButtonComponent} from "../../ui-components/ui-button/ui-button.component";
import {PopupComponent} from "../../../layers/popup/popup.component";

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [
    UiButtonComponent,
    PopupComponent
  ],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.scss'
})
export class SuccessModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {text: string, title: string},
    public dialogRef: MatDialogRef<SuccessModalComponent>,
  ) {}

  closePopupSuccess() {
    this.dialogRef.close();
  }
}
