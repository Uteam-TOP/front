import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {CommandsHackComponent, IHackathonProject} from "./components/commands/commands.component";
import {
    HackathonDataComponent
} from "./components/hackathon-data/hackathon-data.component";
import {
    ManageListParticipantsComponent
} from "./components/manage-list-participants/manage-list-participants.component";
import {PartyComponent} from "./components/party/party.component";
import {
    ScreensaverHackComponent
} from "./components/screensaver/screensaver.component";
import {
    SettingsAdminComponent
} from "./components/settings-admin/settings-admin.component";
import {ActivatedRoute} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map, switchMap} from "rxjs";
import {HackathonService} from "../../../core/services/hackathon.service";
import {UserService} from "../../../core/services/user.service";

@Component({
  selector: 'app-hackathon-page',
  standalone: true,
  imports: [
    CommandsHackComponent,
    HackathonDataComponent,
    ManageListParticipantsComponent,
    PartyComponent,
    ScreensaverHackComponent,
    SettingsAdminComponent,
  ],
  templateUrl: './hackathon-page.component.html',
  styleUrl: './hackathon-page.component.scss'
})
export class HackathonPageComponent implements OnInit {

  private route = inject(ActivatedRoute);
  public hackathonService = inject(HackathonService);
  private userService = inject(UserService);

  paramId: any;
  isOwner: any;

  private id = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')!.toString())
    ),
    { initialValue: '' }
  );

  isAdmin = signal<boolean>(false);
  hackathonData = toSignal(this.hackathonService.getCurrentHackathon(this.id()));
  hackathonProjects = signal<IHackathonProject[]>([]);
  wishingMembers = signal<any>(null);

  constructor(){
    effect(() => {
      const hackathonId = this.hackathonData()?.id;
      if (hackathonId) {
        this.hackathonService.getAllHackathonProjects(hackathonId).subscribe(data => {
          this.hackathonProjects.set(data);
        })
        this.hackathonService.getAllWishingMembers(hackathonId).subscribe(data => {
          console.log('wishingMembers', data);
          this.wishingMembers.set(data);
        })
      }
    })
  }

  ngOnInit(): void {
    this.paramId = this.route.snapshot.paramMap.get('id');

    this.hackathonService.currentHackathonIsOwner$.subscribe((value: boolean) => {
      this.isOwner = value;
    });

    this.userService.userData$.pipe(
      switchMap(userData => this.userService.isAdmin())
    ).subscribe(result => {
      this.isAdmin.set(result);
    })

    if (this.paramId) {
      // this.hackathonService.getCurrentHackathon(this.paramId).subscribe((dataProject: any) => {
      //   this.hackathonService.setCurrentProjectData(dataProject);
      //   this.projectData = dataProject;
      // });
    }

    // console.log(this.wishingMembers());
    console.log(this.hackathonProjects());

  }
}
