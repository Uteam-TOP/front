import {ChangeDetectionStrategy, Component, effect, inject, OnInit, signal} from '@angular/core';
import {CommandsHackComponent} from "./components/commands/commands.component";
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
import {delay, map, of, switchMap} from "rxjs";
import {HackathonService} from "../../../core/services/hackathon.service";
import {UserService} from "../../../core/services/user.service";
import {IHackathonProject} from "../../../core/models/hackathons";
import {CreateEditNominationsComponent} from "./components/create-edit-nominations/create-edit-nominations.component";
import {NominationsComponent} from "./components/nominations/nominations.component";
import {AppointmentWinnersComponent} from "./components/appointment-winners/appointment-winners.component";
import {HackathonTeamMemberDto} from "../../../core/models/hackathonTeamMemberDto";

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
    CreateEditNominationsComponent,
    NominationsComponent,
    AppointmentWinnersComponent,
  ],
  templateUrl: './hackathon-page.component.html',
  styleUrl: './hackathon-page.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush
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
  hackathonNominations = signal<any>(null);

  constructor(){
    effect(() => {
      const hackathonId = this.hackathonData()?.id;
      if (hackathonId) {
        this.hackathonService.getAllHackathonProjects(hackathonId).subscribe(data => {
          this.hackathonProjects.set(data);
        })
        this.hackathonService.getAllWishingMembers(hackathonId).subscribe(data => {
          this.wishingMembers.set(data);
          const admins = data.filter(user =>
            user.hackathonUserRole === HackathonTeamMemberDto.HackathonUserRoleEnum.HackathonAdmin ||
            user.hackathonUserRole === HackathonTeamMemberDto.HackathonUserRoleEnum.HackathonProjectAdmin
          )

          if (admins.length) {
            this.userService.userData$.subscribe(curUser => {
              if (curUser) {
                const currentUserIsAdmin = admins.find(user => user.user?.id === curUser.id);
                if (currentUserIsAdmin) {
                  this.isAdmin.set(true);
                }
              }
            })
          }
          console.log('admins', admins);
        })
        this.hackathonService.getHackathonNominations(hackathonId).subscribe(data => {
          this.hackathonNominations.set(data);
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
      if (result) {
        this.isAdmin.set(true);
      }
    })

    this.hackathonService.updateHackathon$.pipe(
      delay(1000),
      switchMap(updatedData => {
        if (updatedData) {
          if (updatedData.operation === 'add') {
            if (updatedData.type === 'project') {
              return this.hackathonService.getAllHackathonProjects(updatedData.hackathonId).pipe(
                map(hackathonProjects => ({updatedData, items: hackathonProjects}))
              )
            } else {
              return this.hackathonService.getAllWishingMembers(updatedData.hackathonId).pipe(
                map(hackathonMembers => ({updatedData, items: hackathonMembers}))
              )
            }
          } else {
            return of({updatedData, items: []});
          }
        } else {
          return of(null);
        }
      })
    ).subscribe((data: any) => {
      if (data) {

        if (data.items.length) {
          if (data.updatedData.type === 'project') {
            this.hackathonProjects.set(data.items);
          } else {
            this.wishingMembers.set(data.items);
          }
        } else {
          if (data.updatedData.type === "project") {
            if (data.updatedData.operation === "delete") {
              this.hackathonProjects.update(commands => commands.filter(command => command.id !== data.updatedData.id))
            }
            if (data.updatedData.operation === "add") {
              // this.hackathonProjects.update(commands => commands.filter(command => command.id !== data.updatedData.id))
            }
          }
          if (data.updatedData.type === "member") {
            if (data.updatedData.operation === "delete") {
              this.wishingMembers.update(members => members.filter((member: { id: any; }) => member.id !== data.updatedData.id))
            }
          }
        }
      }
    })
  }
}
