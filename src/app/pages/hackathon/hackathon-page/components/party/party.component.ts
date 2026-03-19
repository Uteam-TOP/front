import {Component, input, OnInit} from '@angular/core';
import { PartyItemComponent } from './party-item/party-item.component';

import { PartyService } from './party.service';
import { HackathonService } from '../../../../../components/hackathon/page/hackathon.service';
import {IHackathonTeamMemberDto} from "../../../../../core/models/hackathonTeamMemberDto";

@Component({
  selector: 'app-party',
  standalone: true,
  imports: [PartyItemComponent],
  templateUrl: './party.component.html',
  styleUrl: './party.component.css'
})
export class PartyComponent implements OnInit{

  members = input<IHackathonTeamMemberDto[]>()

  constructor(){}

  ngOnInit(): void {
  }


}
