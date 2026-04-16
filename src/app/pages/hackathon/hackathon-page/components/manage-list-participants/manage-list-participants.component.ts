import {DatePipe} from '@angular/common';
import {Component, effect, inject, input, model, OnInit} from '@angular/core';
import {ManageListParticipantsService} from './manage-list-participants.service';
import {HackathonService} from "../../../../../core/services/hackathon.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {ParticipantCardComponent} from "./participant-card/participant-card.component";
import {MatDialog} from "@angular/material/dialog";
import {SuccessModalComponent} from "../../../../../shared/modals/success-modal/success-modal.component";
import {ConfirmModalComponent} from "../../../../../shared/modals/confirm-modal/confirm-modal.component";
import {
  EHackathonProjectStatus,
  EHackathonUserRole,
  IHackathonMember,
  IHackathonProject
} from "../../../../../core/models/hackathons";

@Component({
  selector: 'app-manage-list-participants',
  standalone: true,
  imports: [ParticipantCardComponent],
  templateUrl: './manage-list-participants.component.html',
  styleUrl: './manage-list-participants.component.css',
  providers: [DatePipe ],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageListParticipantsComponent implements OnInit {
  private hackathonService = inject(HackathonService);
  private dialog = inject(MatDialog);

  commands = model.required<IHackathonProject[]>();
  members = input.required<IHackathonMember[]>();
  data = toSignal(this.hackathonService.currentHackathonData$);

  requestCommands: IHackathonProject[] = [];
  requestMembers: IHackathonMember[] = [];

  confirmedCommands: IHackathonProject[] = [];
  confirmedMembers: IHackathonMember[] = [];

  constructor(public manageListParticipantsService: ManageListParticipantsService) {
    effect(() => {
      const commands = this.commands();
      const members = this.members();
      if (commands.length) {
        this.confirmedCommands = commands.filter(item => item?.hackathonProjectStatus === 'APPROVED');
        this.requestCommands = commands.filter(item => item?.hackathonProjectStatus === null);
      }

      if (members.length) {
        this.confirmedMembers = members.filter(item => item?.hackathonProjectStatus === 'APPROVED');
        this.requestMembers = members.filter(item => item?.hackathonProjectStatus === 'SUBMITTED');
      }

      console.log('members', this.requestMembers);
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
    let dialogRefConfirm = this.dialog.open(ConfirmModalComponent, {
      height: '300px',
      width: '550px',
      data: {title: 'Подтверждение действия', text: 'Вы действительно хотите удалить команду из события?'},
    });

    dialogRefConfirm.afterClosed().subscribe(result => {
      this.hackathonService.deleteProjectToHackathon(id, this.data()?.id).subscribe(result => {
        this.openDialog('Команда удалена')
      });
    })
  }

  acceptProject(data: IHackathonProject) {
    data.hackathonProjectStatus = EHackathonProjectStatus.Approved;
    const hackathonId = this.data()?.id as number;
    this.hackathonService.updateProjectOfHackathon(hackathonId, data).subscribe(result=> {
      this.openDialog('Заявка принята');
    })
  }

  rejectMember(id: number) {
    let dialogRefConfirm = this.dialog.open(ConfirmModalComponent, {
      height: '300px',
      width: '550px',
      data: {title: 'Подтверждение действия', text: 'Вы действительно хотите удалить пользователя из события?'},
    });

    dialogRefConfirm.afterClosed().subscribe(result => {
      if (result) {
        this.hackathonService.deleteWishingMember(id).subscribe(result => {
          this.openDialog('Пользователь удален')
        })
      }

    })
  }

  addMember(data: IHackathonMember) {
    data.hackathonProjectStatus = EHackathonProjectStatus.Approved;
    const hackathonId = this.data()?.id as number;
    this.hackathonService.updateWishingMember(hackathonId, data).subscribe(result=> {
      this.openDialog('Заявка принята');
    })
  }

  setModerator(data: IHackathonMember) {
    const hackathonId = this.data()?.id as number;
    let dialogRefConfirm = this.dialog.open(ConfirmModalComponent, {
      height: '300px',
      width: '550px',
      data: {
        title: 'Подтверждение действия',
        text: `Вы действительно хотите сделать пользователя ${data.user?.firstName} ${data.user?.lastName} модератором?`
      },
    });

    dialogRefConfirm.afterClosed().subscribe(result => {
      if (result) {
        data.hackathonUserRole = EHackathonUserRole.Admin;
        this.hackathonService.updateWishingMember(hackathonId, data).subscribe(result=> {
          this.openDialog('Права изменены',`${data.user?.firstName} ${data.user?.lastName} теперь модератор`);
        })
      }

    })
  }

  removeModerator(data: IHackathonMember) {

    const hackathonId = this.data()?.id as number;

    let dialogRefConfirm = this.dialog.open(ConfirmModalComponent, {
      height: '300px',
      width: '550px',
      data: {
        title: 'Подтверждение действия',
        text: `Вы действительно хотите снять у пользователя ${data.user?.firstName} ${data.user?.lastName} права?`
      },
    });

    dialogRefConfirm.afterClosed().subscribe(result => {
      if (result) {
        data.hackathonUserRole = EHackathonUserRole.User;
        this.hackathonService.updateWishingMember(hackathonId, data).subscribe(result => {
          this.openDialog('Права изменены', `${data.user?.firstName} ${data.user?.lastName} больше не модератор`);
        })
      }
    })
  }

  closeManage() {
    this.hackathonService.page = 'home'
  }

  openDialog(title: string, text: string = '') {
    let dialogRefSuccess = this.dialog.open(SuccessModalComponent, {
      height: '250px',
      width: '400px',
      data: {title, text},
    });

    dialogRefSuccess.afterClosed().subscribe(result => {})
  }
}
