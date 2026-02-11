
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {AvatarPipe} from "../../../../../../shared/pipes/avatar.pipe";


@Component({
  selector: 'app-participant',
  standalone: true,
  imports: [AvatarPipe],
  templateUrl: './participant.component.html',
  styleUrl: './participant.component.css'
})
export class ParticipantComponent {

  @Input() itemData: any;

  constructor(private router: Router){}

  onUserClick(event: MouseEvent): void {
    event.preventDefault();
    this.router.navigate([``, this.itemData.user.nickname]);
  }

}



