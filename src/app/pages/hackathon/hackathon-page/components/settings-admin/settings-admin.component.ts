import {ChangeDetectionStrategy, Component, effect, inject, input} from '@angular/core';
import { PopupDeleteComponent } from '../popup-delete/popup-delete.component';

import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { CollectingApplicationsComponent } from '../collecting-applications/collecting-applications.component';
import {HackathonService} from "../../../../../core/services/hackathon.service";

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

  hackathonProjects = input<any>();
  participantsMembers = input<any>();
  waitingCounts: number = 0;

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
    this.hackathonService.page = 'nominations-form'
  }

  // getWaitingCounts(): number {
  //   return
  // }

}
