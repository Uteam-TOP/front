
import {Component, inject, input, output} from '@angular/core';
import {HackathonService} from "../../../../../core/services/hackathon.service";
import {IHackathonDto} from "../../../../../core/models/hackathonDto";

@Component({
  selector: 'app-popup-delete',
  standalone: true,
  imports: [],
  templateUrl: './popup-delete.component.html',
  styleUrl: './popup-delete.component.css'
})
export class PopupDeleteComponent {

  isPopupOpen = false;
  private hackathonService = inject(HackathonService);
  onDelete = output();

  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  token(): string {
    const value = "dcsd";
    return value ? value : '';
  }

  delete() {
    this.onDelete.emit();
  }
}
