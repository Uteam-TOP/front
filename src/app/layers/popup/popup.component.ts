import {Component, output} from '@angular/core';
import {UiButtonComponent} from "../../shared/ui-components/ui-button/ui-button.component";

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    UiButtonComponent
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  close = output()

  closePopup() {
    this.close.emit()
  }
}
