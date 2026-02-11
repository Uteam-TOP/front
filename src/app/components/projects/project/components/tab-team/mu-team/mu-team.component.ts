
import {Component, effect, inject, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../project.service';
import { PopUpResponseTeamService } from '../../pop-up-response-team/pop-up-response-team.service';
import { TeamValueComponent } from './team-value/team-value.component';
import { MyTeamService } from './my-team.service';
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-mu-team',
  standalone: true,
  imports: [TeamValueComponent],
  templateUrl: './mu-team.component.html',
  styleUrl: './mu-team.component.css'
})
export class MuTeamComponent implements OnInit {

  private myTeamService = inject(MyTeamService);

  teamMembers = toSignal(this.myTeamService.teamMembers$);

  constructor(public projectService: ProjectService) {
    effect(() => {
      console.log('teamMembers', this.teamMembers());
    });
  }

  ngOnInit(): void {
    let projectData = this.projectService.getCurrentProjectData();
    this.myTeamService.projectId = projectData.id;
    this.myTeamService.loadData();

    // this.myTeamService.teamMembers$.subscribe((value: any) => {
    //   this.teamMembers = value;
    // })
  }

}
