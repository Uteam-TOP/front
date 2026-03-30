
import { Component, OnInit } from '@angular/core';
import { ScreensaverHackComponent } from '../../../pages/hackathon/hackathon-page/components/screensaver/screensaver.component';
import { HackathonDataComponent } from '../../../pages/hackathon/hackathon-page/components/hackathon-data/hackathon-data.component';
import { CommandsHackComponent } from '../../../pages/hackathon/hackathon-page/components/commands/commands.component';
import { PartyComponent } from '../../../pages/hackathon/hackathon-page/components/party/party.component';
import { SettingsAdminComponent } from '../../../pages/hackathon/hackathon-page/components/settings-admin/settings-admin.component';
import { HackathonService } from './hackathon.service';
import { ActivatedRoute } from '@angular/router';
import { ManageListParticipantsComponent } from '../../../pages/hackathon/hackathon-page/components/manage-list-participants/manage-list-participants.component';

@Component({
  selector: 'app-hackathon',
  standalone: true,
  imports: [ScreensaverHackComponent, HackathonDataComponent, CommandsHackComponent, PartyComponent, SettingsAdminComponent, ManageListParticipantsComponent],
  templateUrl: './hackathon.component.html',
  styleUrl: './hackathon.component.css'
})
export class HackathonComponent implements OnInit{

  paramId: any;
  projectData: any;
  isOwner: any;

  constructor(public hackathonService:HackathonService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.paramId = this.route.snapshot.paramMap.get('id');

    this.hackathonService.currentProjectIsOwner$.subscribe((value: boolean) => {

      this.isOwner = value;
    });

    if (this.paramId) {
      this.hackathonService.getCurrentHackathon(this.paramId).subscribe((dataProject: any) => {
        this.hackathonService.setCurrentProjectData(dataProject);
        this.projectData = dataProject;
      });
    }

  }

}
