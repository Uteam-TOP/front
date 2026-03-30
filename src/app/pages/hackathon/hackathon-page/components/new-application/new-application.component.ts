
import {Component, effect, Inject, inject, OnInit, signal} from '@angular/core';
import { ProjectComponent } from '../project/project.component';
import { FormSettingService } from '../../../../../components/form/form-setting.service';
import { SettingHeaderService } from '../../../../../components/setting-header.service';
import { Router } from '@angular/router';
import { PopUpErrorCreateService } from '../../../../../components/pop-up-error-create/pop-up-error-create.service';
import { ResumePersonComponent } from '../resume-person/resume-person.component';
import { NewApplicationService } from './new-application.service';
import {HackathonService} from "../../../../../core/services/hackathon.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {IProjectDto} from "../../../../../core/models/projectDto";
import {toSignal} from "@angular/core/rxjs-interop";
import {ProjectService} from "../project/project.service";
import {IHackathonDto} from "../../../../../core/models/hackathonDto";
import {ResumePersonService} from "../resume-person/resume-person.service";
import {UserService} from "../../../../../core/services/user.service";
import {SuccessModalComponent} from "../../../../../shared/modals/success-modal/success-modal.component";

@Component({
  selector: 'app-new-application',
  standalone: true,
  imports: [ProjectComponent, ResumePersonComponent],
  templateUrl: './new-application.component.html',
  styleUrl: './new-application.component.css'
})
export class NewApplicationComponent implements OnInit {

  private hackathonService = inject(HackathonService);
  private formSettingService = inject(FormSettingService);
  private settingHeaderService = inject(SettingHeaderService);
  private router = inject(Router);
  private popUpErrorCreateService = inject(PopUpErrorCreateService);
  private newApplicationService = inject(NewApplicationService);
  private projectService = inject(ProjectService);
  private resumePersonService = inject(ResumePersonService);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  isPopupOpen = false;
  isPopupsSuccessOpen = false;

  resumes: any;
  projects?: IProjectDto[];
  selectedProject = toSignal(this.projectService.selectedProject$);
  selectedProjectData = signal<IProjectDto | null>(null);

  selectedResume = toSignal(this.resumePersonService.selectedResume$);
  currentUserData = toSignal(this.userService.userData$);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {hackathon: IHackathonDto},
    public dialogRef: MatDialogRef<NewApplicationComponent>,
  ) {
    effect(() => {
      const projectId = this.selectedProject();

      if (projectId) {
        this.projectService.getProjectData(projectId).subscribe(data => {
          this.selectedProjectData.set(data);
        })
      }
    })
  }

  ngOnInit(): void {
    this.newApplicationService.getCurrentUser().subscribe((data: any) => {
      this.resumes = data;
    })

    this.newApplicationService.getCurrentProjects().subscribe((data: any) => {
      this.projects = data;
    })
  }

  onItemSelected(selectedItem: any): void {
    if (selectedItem) {
      console.log('selectedItem', selectedItem);
    } else {
      // Обработка снятия выбора
    }
  }

  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.dialogRef.close();
  }

  openPopupSuccess() {
    this.isPopupsSuccessOpen = true;
    this.isPopupOpen = false;
    const project = this.selectedProjectData() as IProjectDto;
    if (project) {
      const addProjectData = {
        hackathon: this.data.hackathon,
        project: project
      }
      if (this.data.hackathon.id) {
        this.hackathonService.addProjectToHackathon(this.data.hackathon.id, addProjectData).subscribe(data => {
          this.openSuccessModal();
        });
      }
    } else {
      const addResumeData = {
        hackathonId: this.data.hackathon.id,
        user: this.currentUserData(),
        hackathonUserRole: "HACKATHON_USER",
        resume: this.selectedResume(),
        hackathonProjectStatus: "SUBMITTED"
      }
      if (this.data.hackathon.id) {
        this.hackathonService.addWishingMember(this.data.hackathon.id, addResumeData).subscribe(data => {
          this.openSuccessModal();
        });
      }
    }
  }

  openSuccessModal() {
    let dialogRef = this.dialog.open(SuccessModalComponent, {
      height: '250px',
      width: '450px',
      data: {title: 'ЗАЯВКА ОТПРАВЛЕНА!', text: 'Ожидайте подтверждения от организатора хакатона'},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    })
  }

  handlePostProject(): void {
    const fullAccess = localStorage.getItem('fullAccess')
    const userNickname = localStorage.getItem('userNickname')
    if (fullAccess == 'b326b5062b2f0e69046810717534cb09') {
      this.formSettingService.isheading = false;
      this.settingHeaderService.post = false;
      this.settingHeaderService.shared = false;
      this.router.navigate([`/${userNickname}/account/newProject`]);
    } else {
      this.popUpErrorCreateService.visible = true;
    }
  }


}
