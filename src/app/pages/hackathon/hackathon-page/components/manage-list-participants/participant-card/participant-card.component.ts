import {Component, input} from '@angular/core';
import {AvatarPipe} from "../../../../../../shared/pipes/avatar.pipe";
import {UiButtonComponent} from "../../../../../../shared/ui-components/ui-button/ui-button.component";
import {IHackathonProject} from "../../commands/commands.component";
import {DatePipe} from "@angular/common";
import {ManageListParticipantsService} from "../manage-list-participants.service";
import {HackathonService} from "../../../../../../components/hackathon/page/hackathon.service";

@Component({
  selector: 'app-participant-card',
  standalone: true,
  imports: [
    AvatarPipe,
    UiButtonComponent
  ],
  templateUrl: './participant-card.component.html',
  styleUrl: './participant-card.component.scss'
})
export class ParticipantCardComponent {
  data = input.required<IHackathonProject>();
  isAwaiting = input<boolean>(true);
  type = input<'command' | 'member'>('command');

  constructor(private datePipe: DatePipe) { }

  formatDate(date: any): string {
    if (date) {
      return this.datePipe.transform(date, 'dd.MM.yyyy в HH:mm') || '';
    } else {
      return '-';
    }

  }

  rejectCommand(id: any) {

  }

  addCommand(data: any) {

  }
}
