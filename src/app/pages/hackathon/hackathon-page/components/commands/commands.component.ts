
import {Component, effect, input, OnInit} from '@angular/core';
import { CommandsItemComponent } from './commands-item/commands-item.component';
import { CommandsService } from './commands.service';
import { HackathonService } from '../../../../../components/hackathon/page/hackathon.service';
import {IHackathonDto} from "../../../../../core/models/hackathonDto";
import {IProjectDto} from "../../../../../core/models/projectDto";

export interface IHackathonProject {
  id: number;
  createdAt: number;
  hackathon: IHackathonDto,
  project: IProjectDto
}

@Component({
  selector: 'app-commandsHack',
  standalone: true,
  imports: [CommandsItemComponent],
  templateUrl: './commands.component.html',
  styleUrl: './commands.component.css'
})
export class CommandsHackComponent implements OnInit{
  projects = input.required<IHackathonProject[]>()
  dataHackathon: any;

  constructor(private commandsService:CommandsService, private hackathonService:HackathonService){
    effect(() => {
      console.log(this.projects())
    });
  }

  ngOnInit(): void {
    this.hackathonService.currentProjectData$.subscribe((data: any)=>{
      this.dataHackathon = data;
    })
  }


}
