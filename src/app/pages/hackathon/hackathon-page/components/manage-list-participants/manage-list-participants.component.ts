import { DatePipe } from '@angular/common';
import {Component, inject, input, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageListParticipantsService } from './manage-list-participants.service';
import {HackathonService} from "../../../../../core/services/hackathon.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {IHackathonProject} from "../commands/commands.component";
import {ParticipantCardComponent} from "./participant-card/participant-card.component";

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  commands = input.required<IHackathonProject[]>();
  members = input.required<any[]>();

  constructor(public manageListParticipantsService: ManageListParticipantsService) { }

  data = toSignal(this.hackathonService.currentHackathonData$);

  ngOnInit(): void {
    console.log('test');
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

  closeManage() {
    this.hackathonService.page = 'home'
  }

}
