import {Component, effect, inject, input} from '@angular/core';
import {UiButtonComponent} from "../../../../../shared/ui-components/ui-button/ui-button.component";
import {HackathonService} from "../../../../../core/services/hackathon.service";
import {IHackathonNomination} from "../../../../../core/models/hackathons";
import {SortByPipe} from "../../../../../shared/pipes/sort-by.pipe";
import {CommandsItemComponent} from "../commands/commands-item/commands-item.component";

@Component({
  selector: 'app-nominations',
  standalone: true,
  imports: [
    UiButtonComponent,
    SortByPipe,
    CommandsItemComponent
  ],
  templateUrl: './nominations.component.html',
  styleUrl: './nominations.component.scss'
})
export class NominationsComponent {
  data = input.required<IHackathonNomination[]>();
  isAdmin = input<boolean>(false);

  private hackathonService = inject(HackathonService);
  showWinners = false;

  constructor() {
    effect(() => {
      const data = this.data();
      if (data) {
        data.forEach(nomination => {
          if (nomination.hackathonProjectDto) {
            this.showWinners = true;
          }
        })
      }
    });
  }

  openCreateNominationsForm() {
    this.hackathonService.page = 'nominations-form'
  }
}
