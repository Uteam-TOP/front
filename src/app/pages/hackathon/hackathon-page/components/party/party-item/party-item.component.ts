import { Component, Input } from '@angular/core';
import {AvatarPipe} from "../../../../../../shared/pipes/avatar.pipe";

@Component({
  selector: 'app-party-item',
  standalone: true,
  imports: [
    AvatarPipe
  ],
  templateUrl: './party-item.component.html',
  styleUrl: './party-item.component.css'
})
export class PartyItemComponent {
  @Input() item: any;
}
