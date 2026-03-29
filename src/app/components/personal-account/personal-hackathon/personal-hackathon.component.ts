import {Component, input} from '@angular/core';
import {DatePipe, UpperCasePipe} from "@angular/common";
import {IHackathonDto} from "../../../core/models/hackathonDto";

@Component({
  selector: 'app-personal-hackathon',
  standalone: true,
  imports: [
    DatePipe,
    UpperCasePipe
  ],
  templateUrl: './personal-hackathon.component.html',
  styleUrl: './personal-hackathon.component.scss'
})
export class PersonalHackathonComponent {
  item = input.required<IHackathonDto>()
}
