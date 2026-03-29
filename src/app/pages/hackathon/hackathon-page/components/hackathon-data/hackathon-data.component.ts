
import {Component, inject, input, OnInit} from '@angular/core';
import { NewApplicationComponent } from '../new-application/new-application.component';
import { HackathonService } from '../../../../../components/hackathon/page/hackathon.service';
import {IHackathonDto} from "../../../../../core/models/hackathonDto";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-hackathon-data',
  standalone: true,
  imports: [NewApplicationComponent],
  templateUrl: './hackathon-data.component.html',
  styleUrl: './hackathon-data.component.scss'
})
export class HackathonDataComponent implements OnInit{

  private dialog = inject(MatDialog);
  dataHackathon = input<IHackathonDto>();

  constructor(){}

  ngOnInit(): void {
    // this.hackathonService.currentProjectData$.subscribe((data: any)=>{
    //   this.dataHackathon = data;
    // })
  }


  getFormatText(format: string): string {
    switch(format) {
      case 'ONLINE': return 'онлайн';
      case 'OFFLINE': return 'оффлайн';
      case 'HYBRID': return 'онлайн + оффлайн';
      default: return 'Неизвестный формат';
    }
  }

  formatRussianDate(date: number): string {
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    const d = new Date((date*1000));
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${month}`;
  }

  openPopup() {
    let dialogRef = this.dialog.open(NewApplicationComponent, {
      height: '551px',
      width: '1186px',
      data: {hackathon: this.dataHackathon()},
    })
  }

}
