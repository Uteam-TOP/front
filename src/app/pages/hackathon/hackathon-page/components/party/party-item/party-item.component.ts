import { Component, Input } from '@angular/core';
import {AvatarPipe} from "../../../../../../shared/pipes/avatar.pipe";
import {IHackathonMember} from "../../../../../../core/models/hackathons";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-party-item',
  standalone: true,
  imports: [
    AvatarPipe,
    NgClass
  ],
  templateUrl: './party-item.component.html',
  styleUrl: './party-item.component.css'
})
export class PartyItemComponent {
  @Input() item?: IHackathonMember;
}
