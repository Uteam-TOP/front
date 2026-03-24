import {Component, input, Input} from '@angular/core';
import {AvatarPipe} from "../../../../../../shared/pipes/avatar.pipe";
import {NgClass} from "@angular/common";
import {IHackathonProject} from "../commands.component";

@Component({
  selector: 'app-commands-item',
  standalone: true,
  imports: [
    AvatarPipe,
    NgClass
  ],
  templateUrl: './commands-item.component.html',
  styleUrl: './commands-item.component.css'
})
export class CommandsItemComponent {
  item = input.required<IHackathonProject>()
}
