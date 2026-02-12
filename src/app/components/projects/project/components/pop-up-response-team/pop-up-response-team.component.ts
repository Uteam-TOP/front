import {ChangeDetectorRef, Component, inject} from '@angular/core';
import { PopUpResponseTeamService } from './pop-up-response-team.service';

import { ActiveResumesComponent } from './active-resumes/active-resumes.component';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../project.service';
import {UiButtonComponent} from "../../../../../shared/ui-components/ui-button/ui-button.component";
import {Router, RouterLink} from "@angular/router";
import {UserService} from "../../../../../core/services/user.service";
import {toSignal} from "@angular/core/rxjs-interop";
@Component({
  selector: 'app-pop-up-response-team',
  standalone: true,
  imports: [ActiveResumesComponent, FormsModule, UiButtonComponent, RouterLink],
  templateUrl: './pop-up-response-team.component.html',
  styleUrl: './pop-up-response-team.component.css'
})
export class PopUpResponseTeamComponent {

  private userService = inject(UserService);

  currentUser = toSignal(this.userService.userData$);

  constructor(public popUpResponseTeamService: PopUpResponseTeamService,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) { }
  resumesList: any[] = [];
  textarea: string = '';
  isCurrect: boolean = false;

  ngOnInit(): void {
    this.isCurrect = false;
    this.popUpResponseTeamService.selectResume('');
    this.popUpResponseTeamService.getCardsData().subscribe(
      (response: any) => {
        this.resumesList = response;
      },
      (error: any) => {
        console.error('Ошибка при загрузке данных резюме:', error);
      }
    );
    this.projectService.currentProjectData$.subscribe((value: any) => {
      this.popUpResponseTeamService.projectData = value;
    })
  }

  submit(): void {

    this.popUpResponseTeamService.setTeamProjectWithResume().subscribe(
      (response: any) => {
        this.projectService.updateUserAppliedStatus();
        this.isCurrect = true;
        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error('Ошибка при загрузке данных резюме:', error);
      }
    );

    //this.popUpResponseTeamService.hidePopup();
  }

  cancel(): void {
    this.popUpResponseTeamService.hidePopup();
  }

}
