import {Component, inject, input} from '@angular/core';
import {UiButtonComponent} from "../../../../../shared/ui-components/ui-button/ui-button.component";
import {IHackathonDto} from "../../../../../core/models/hackathonDto";
import {HackathonService} from "../../../../../core/services/hackathon.service";
import {IHackathonNomination, IHackathonProject} from "../../../../../core/models/hackathons";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect, MatSelectTrigger} from "@angular/material/select";
import {CommandsItemComponent} from "../commands/commands-item/commands-item.component";
import {concatMap, debounceTime, from} from "rxjs";
import {SuccessModalComponent} from "../../../../../shared/modals/success-modal/success-modal.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-appointment-winners',
  standalone: true,
  imports: [
    UiButtonComponent,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    CommandsItemComponent,
    MatSelectTrigger
  ],
  templateUrl: './appointment-winners.component.html',
  styleUrl: './appointment-winners.component.scss'
})
export class AppointmentWinnersComponent {
  hackathon = input.required<IHackathonDto>();
  projects = input.required<IHackathonProject[]>();
  nominations = input.required<IHackathonNomination[]>();
  private hackathonService = inject(HackathonService);
  private dialog = inject(MatDialog);

  selected: any[] = [];

  closeWinnersForm() {
    this.hackathonService.page = 'home'
  }

  saveWinners() {
    let nominations: any[] = [];
    this.nominations().forEach(nomination => {
      if (nomination.hackathonProjectDto) {
        nominations.push(nomination);
      }
    })

    console.log(nominations);

    from(nominations).pipe(
      concatMap(item => this.hackathonService.updateHackathonNomination(item)),
      debounceTime(500)
    ).subscribe(
      result => {
        this.openSuccessModal();
      }
    );

  }

  openSuccessModal() {
    let dialogRef = this.dialog.open(SuccessModalComponent, {
      height: '250px',
      width: '450px',
      data: {title: '', text: 'Места были назначены'},
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    })
  }
}
