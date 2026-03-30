import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {resumeVacancyDto} from "../../../../../core/models/resumeVacancyDto";

@Injectable({
  providedIn: 'root'
})
export class ResumePersonService {

  private selectedResumeSubject = new BehaviorSubject<resumeVacancyDto | null>(null);
  selectedResume$ = this.selectedResumeSubject.asObservable();

  selectResume(project: resumeVacancyDto): void {
    this.selectedResumeSubject.next(project);
  }

  constructor() { }
}
