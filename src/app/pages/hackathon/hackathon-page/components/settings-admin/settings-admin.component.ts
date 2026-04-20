import {ChangeDetectionStrategy, Component, effect, inject, input} from '@angular/core';
import { PopupDeleteComponent } from '../popup-delete/popup-delete.component';

import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { CollectingApplicationsComponent } from '../collecting-applications/collecting-applications.component';
import {HackathonService} from "../../../../../core/services/hackathon.service";
import {HackathonDto, IHackathonDto} from "../../../../../core/models/hackathonDto";
import {ConfirmModalComponent} from "../../../../../shared/modals/confirm-modal/confirm-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {SuccessModalComponent} from "../../../../../shared/modals/success-modal/success-modal.component";

@Component({
  selector: 'app-settings-admin',
  standalone: true,
  imports: [PopupDeleteComponent, CollectingApplicationsComponent, RouterLink],
  templateUrl: './settings-admin.component.html',
  styleUrl: './settings-admin.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAdminComponent {
  private hackathonService = inject(HackathonService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  hackathonProjects = input<any>();
  participantsMembers = input<any>();
  hackathon = input<IHackathonDto>();
  waitingCounts: number = 0;

  statuses = HackathonDto.RegistrationStatusEnum;

  paramId = this.route.snapshot.paramMap.get('id');

  constructor() {
    effect(() => {
      this.waitingCounts = this.hackathonProjects().filter((project: any) => project.hackathonProjectStatus === null).length;
    });
  }

  openManage() {
    this.hackathonService.page = 'manage'
  }

  openNominationsForm() {
    this.hackathonService.page = 'appointment-winners'
  }

  delete() {
    const hackathon = this.hackathon();
    if (hackathon) {
      this.hackathonService.deleteHackathon(hackathon.id).subscribe(
        result => {
          this.router.navigate(['/hackathons']);
        }
      )
    }

  }

  updateCollecting(status: HackathonDto.RegistrationStatusEnum) {
    const hackathon = this.hackathon();
    if (hackathon) {
      hackathon.registrationStatus = status;
      this.hackathonService.editHackathon(hackathon, hackathon.id).subscribe(
        result => {
          this.openDialog(`Статус хакатона ${result.title} был изменен на ${result.registrationStatus}`)
        }
      )
    }
  }

  acceptHackathon() {
    let dialogRefConfirm = this.dialog.open(ConfirmModalComponent, {
      height: '300px',
      width: '550px',
      data: {title: 'Подтверждение действия', text: 'Вы действительно хотите одобрить хакатон?'},
    });

    dialogRefConfirm.afterClosed().subscribe(result => {
      if (result) {
        this.updateCollecting(HackathonDto.RegistrationStatusEnum.Open);
      }
    })
  }

  openDialog(title: string, text: string = '') {
    let dialogRefSuccess = this.dialog.open(SuccessModalComponent, {
      height: '250px',
      width: '400px',
      data: {title, text},
    });

    dialogRefSuccess.afterClosed().subscribe(result => {})
  }

  // getWaitingCounts(): number {
  //   return
  // }

}
