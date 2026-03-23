import { DatePipe } from '@angular/common';
import {Component, effect, inject, input, model, OnInit} from '@angular/core';
import { ManageListParticipantsService } from './manage-list-participants.service';
import {HackathonService} from "../../../../../core/services/hackathon.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {IHackathonProject} from "../commands/commands.component";
import {ParticipantCardComponent} from "./participant-card/participant-card.component";
import {MatDialog} from "@angular/material/dialog";
import {SuccessModalComponent} from "../../../../../shared/modals/success-modal/success-modal.component";
import {result} from "lodash";

@Component({
  selector: 'app-manage-list-participants',
  standalone: true,
  imports: [ParticipantCardComponent],
  templateUrl: './manage-list-participants.component.html',
  styleUrl: './manage-list-participants.component.css',
  providers: [DatePipe ]
})
export class ManageListParticipantsComponent implements OnInit {
  private hackathonService = inject(HackathonService);
  private dialog = inject(MatDialog);

  commands = model.required<IHackathonProject[]>();
  members = input.required<any[]>();
  data = toSignal(this.hackathonService.currentHackathonData$);

  requestCommands: IHackathonProject[] = [];
  requestMembers: any[] = [];

  confirmedCommands: IHackathonProject[] = [];
  confirmedMembers: any[] = [];

  constructor(public manageListParticipantsService: ManageListParticipantsService) {
    effect(() => {
      const commands = this.commands();
      if (commands.length) {
        this.confirmedCommands = commands.filter(item => item?.hackathonProjectStatus === 'APPROVED');
        this.requestCommands = commands.filter(item => item?.hackathonProjectStatus === null);
      }
    });
  }


  ngOnInit(): void {
    if (this.data()) {
      const data = this.data();

      if (data && data.id) {
        // Обработка команд
        this.manageListParticipantsService.getsCommands(data.id).subscribe({
          next: (values: any[]) => {
            if (values?.length) {
              const pendingTeams = values.filter(item => item?.status === 'PENDING');
              const activeTeams = values.filter(item => item?.status !== 'PENDING');

              this.manageListParticipantsService.setNewTeamRequests(pendingTeams || []);
              this.manageListParticipantsService.setActiveTeams(activeTeams || []);
            }
          },
          error: (err) => console.error('Error loading teams:', err)
        });

        // Обработка участников
        this.manageListParticipantsService.getsPerson(data.id).subscribe({
          next: (values: any[]) => {
            if (values?.length) {
              const pendingIndividuals = values.filter(item => item?.status === 'PENDING');
              const activeIndividuals = values.filter(item => item?.status !== 'PENDING');

              this.manageListParticipantsService.setNewIndividualRequests(pendingIndividuals || []);
              this.manageListParticipantsService.setActiveIndividuals(activeIndividuals || []);
            }
          },
          error: (err) => console.error('Error loading individuals:', err)
        });
      }
    }
  }

  rejectProject(id: number) {
    this.hackathonService.deleteProjectToHackathon(id, this.data()?.id).subscribe(result => {
      this.openDialog('Заявка отклонена')
    });
  }

  acceptProject(data: IHackathonProject) {
    data.hackathonProjectStatus = 'APPROVED';
    const hackathonId = this.data()?.id as number;
    this.hackathonService.updateProjectOfHackathon(hackathonId, data).subscribe(result=> {
      this.openDialog('Заявка принята');
    })
  }

  closeManage() {
    this.hackathonService.page = 'home'
  }

  openDialog(title: string, text: string = '') {
    let dialogRef = this.dialog.open(SuccessModalComponent, {
      height: '200px',
      width: '400px',
      data: {title, text},
    });

    dialogRef.afterClosed().subscribe(result => {})
  }

}
