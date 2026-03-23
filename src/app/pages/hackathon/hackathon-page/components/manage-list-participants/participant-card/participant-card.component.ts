import {Component, input, output} from '@angular/core';
import {AvatarPipe} from "../../../../../../shared/pipes/avatar.pipe";
import {UiButtonComponent} from "../../../../../../shared/ui-components/ui-button/ui-button.component";
import {IHackathonProject} from "../../commands/commands.component";
import {DatePipe} from "@angular/common";

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

  onReject  = output<number>();
  onAdd = output<IHackathonProject>();

  constructor(private datePipe: DatePipe) { }

  formatDate(date: any): string {
    if (date) {
      return this.datePipe.transform(date, 'dd.MM.yyyy в HH:mm') || '';
    } else {
      return '-';
    }

  }

  rejectCommand(id: number) {
    this.onReject.emit(id);
  }

  addCommand(data: IHackathonProject) {
    this.onAdd.emit(data);
  }
}
