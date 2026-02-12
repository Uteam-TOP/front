import {Component, inject, OnInit, signal} from '@angular/core';
import { ProjectService } from '../../../project.service';

import { NewPeopleService } from './new-people.service';
import { ItemNewPeopleComponent } from './item-new-people/item-new-people.component';
import {toSignal} from "@angular/core/rxjs-interop";
import {TeamValueComponent} from "../mu-team/team-value/team-value.component";
import {MyTeamService} from "../mu-team/my-team.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-new-people',
  standalone: true,
  imports: [ItemNewPeopleComponent, TeamValueComponent],
  templateUrl: './new-people.component.html',
  styleUrl: './new-people.component.css'
})
export class NewPeopleComponent {

  private projectService = inject(ProjectService);
  private newPeopleService = inject(NewPeopleService);
  private projectData = this.projectService.getCurrentProjectData();
  private myTeamService = inject(MyTeamService);
  cardItems = signal<any[]>([]);

  constructor() {

  }


  ngOnInit() {
    this.myTeamService.teamMembers$.subscribe(value => {
      this.cardItems.set([]);
    })

    this.newPeopleService.getNewPeopleService(this.projectData.id).subscribe(value => {
      this.cardItems.set(value);
    })
  }
}
