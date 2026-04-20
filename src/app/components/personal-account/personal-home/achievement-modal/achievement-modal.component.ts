import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IUserAchievement} from "../../../../core/models/userDto";
import {PopupComponent} from "../../../../layers/popup/popup.component";
import {UiButtonComponent} from "../../../../shared/ui-components/ui-button/ui-button.component";

@Component({
  selector: 'app-achievement-modal',
  standalone: true,
  imports: [
    PopupComponent,
    UiButtonComponent
  ],
  templateUrl: './achievement-modal.component.html',
  styleUrl: './achievement-modal.component.scss'
})
export class AchievementModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {achievement: IUserAchievement},
    public dialogRef: MatDialogRef<AchievementModalComponent>,
  ) {}

  closePopup() {
    this.dialogRef.close();
  }
}
