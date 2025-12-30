import { Component, Input } from '@angular/core';
import {AvatarPipe} from "../../../../../../pipes/avatar.pipe";

@Component({
  selector: 'app-commands-item',
  standalone: true,
    imports: [
        AvatarPipe
    ],
  templateUrl: './commands-item.component.html',
  styleUrl: './commands-item.component.css'
})
export class CommandsItemComponent {
  @Input() item: any;
}
