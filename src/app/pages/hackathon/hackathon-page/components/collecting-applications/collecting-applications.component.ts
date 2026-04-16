
import {Component, effect, input, output} from '@angular/core';
import {HackathonDto, IHackathonDto} from "../../../../../core/models/hackathonDto";

@Component({
  selector: 'app-collecting-applications',
  standalone: true,
  imports: [],
  templateUrl: './collecting-applications.component.html',
  styleUrl: './collecting-applications.component.css'
})
export class CollectingApplicationsComponent {

  isPopupOpen = false;
  isStopCollecting: boolean = false;
  btnText: string = 'остановить';

  hackathon = input<IHackathonDto>();

  onStop = output()
  onStart = output();

  status = HackathonDto.RegistrationStatusEnum;

  constructor() {
    effect(() => {
      const hackathon = this.hackathon();
      if (hackathon) {
        console.log('hackathon', hackathon);
        if (hackathon?.registrationStatus === HackathonDto.RegistrationStatusEnum.Closed) {
          this.btnText = 'возобновить';
        } else {
          this.btnText = 'остановить';
        }
      }
    });
  }

  openPopup() {
    this.isPopupOpen = true;


  }

  closePopup() {
    this.isPopupOpen = false;
  }


  stopping(){
    this.isPopupOpen = false;
    this.isStopCollecting = true;
    this.btnText = 'возобновить';
    this.onStop.emit();
  }

  resume(){
    this.isPopupOpen = false;
    this.isStopCollecting = false;
    this.btnText = 'остановить';
    this.onStart.emit();
  }
}
