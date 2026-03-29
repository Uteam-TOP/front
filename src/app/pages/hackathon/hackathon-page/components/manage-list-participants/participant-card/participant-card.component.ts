import {ChangeDetectionStrategy, Component, effect, input, model, output, signal} from '@angular/core';
import {AvatarPipe} from "../../../../../../shared/pipes/avatar.pipe";
import {UiButtonComponent} from "../../../../../../shared/ui-components/ui-button/ui-button.component";
import {DatePipe} from "@angular/common";
import {TagComponent} from "../../../../../../shared/ui-components/tag/tag.component";
import {EHackathonUserRole, IHackathonMember, IHackathonProject} from "../../../../../../core/models/hackathons";

@Component({
  selector: 'app-participant-card',
  standalone: true,
  imports: [
    AvatarPipe,
    UiButtonComponent,
    DatePipe,
    TagComponent
  ],
  templateUrl: './participant-card.component.html',
  styleUrl: './participant-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantCardComponent {
  data = model.required<IHackathonProject | IHackathonMember>();
  isAwaiting = input<boolean>(false);
  type = input<'team' | 'member'>('team');

  team = signal<IHackathonProject>({} as IHackathonProject);
  member = signal<IHackathonMember>({} as IHackathonMember);

  onRejectTeam  = output<number>();
  onAddTeam = output<IHackathonProject>();

  onRejectMember  = output<number>();
  onAddMember = output<IHackathonMember>();

  onSetModerator = output<IHackathonMember>();
  onRemoveModerator = output<IHackathonMember>();

  constructor() {
    effect(() => {
      if (this.type() === 'member') {
        this.member.set(this.data() as IHackathonMember);
      } else {
        this.team.set(this.data() as IHackathonProject);
      }
    }, { allowSignalWrites: true });
  }

  rejectTeam(id: number) {
    this.onRejectTeam.emit(id);
  }

  addTeam(data: IHackathonProject) {
    this.onAddTeam.emit(data);
  }

  rejectMember(id: number) {
    this.onRejectMember.emit(id);
  }

  addMember(data: IHackathonMember) {
    this.onAddMember.emit(data);
  }

  setModerator(data: IHackathonMember) {
    this.onSetModerator.emit(data);
  }

  removeModerator(data: IHackathonMember) {
    this.onRemoveModerator.emit(data);
  }

  isAdmin(role?: string): boolean {
    return role === EHackathonUserRole.Admin;
  }
}
