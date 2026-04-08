
import {Component, effect, inject, input, OnInit, signal} from '@angular/core';
import { NewApplicationComponent } from '../new-application/new-application.component';
import {IHackathonDto} from "../../../../../core/models/hackathonDto";
import {MatDialog} from "@angular/material/dialog";
import {IHackathonProject} from "../../../../../core/models/hackathons";
import {UserService} from "../../../../../core/services/user.service";
import {PopUpEntryService} from "../../../../../components/pop-up-entry/pop-up-entry.service";

@Component({
  selector: 'app-hackathon-data',
  standalone: true,
  imports: [],
  templateUrl: './hackathon-data.component.html',
  styleUrl: './hackathon-data.component.scss'
})
export class HackathonDataComponent implements OnInit{

  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  private popUpEntryService = inject(PopUpEntryService);

  dataHackathon = input<IHackathonDto>();
  isAdmin = input<boolean>(false);
  projects = input<IHackathonProject[]>([]);
  members = input<any[]>([]);

  currentUserChecked: boolean = false;
  userIsMember = signal<boolean>(false);

  constructor(){
    effect(() => {
      console.log('update data component')
      this.isUserMember();
    }, { allowSignalWrites: true });
  }

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
    let userData = localStorage.getItem('authToken');
    let userNickname = localStorage.getItem('userNickname');
    if (!userData && !userNickname) {
      this.popUpEntryService.showDialog(true, 'Войдите, чтобы оставить заявку на участие');
      return;
    }

    let dialogRef = this.dialog.open(NewApplicationComponent, {
      height: '551px',
      width: '1186px',
      data: {hackathon: this.dataHackathon()},
    })
  }

  isUserMember() {
    const members = this.members();
    const projects = this.projects();
    if (members && projects) {
      this.userService.userData$.subscribe(user => {
        projects.forEach((project) => {
          if (project) {
            this.currentUserChecked = true;
            if (project.project.owner?.id === user.id) {
              this.userIsMember.set(true);
            }
          }
        });
        if (members && members.length) {
          if (!this.userIsMember()) {
            this.userIsMember.set(members.some(member => member.user.id === user.id));
            this.currentUserChecked = true;
          }

        }
      })
    }
  }

}
