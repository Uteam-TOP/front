import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TypeProjectComponent} from "./type-project/type-project.component";
import {ActivatedRoute, Router} from "@angular/router";
import {
  CreateEditProjectsService
} from "../../../components/hackathon/create-edit-hackathon/create-edit-projects.service";
import {forbiddenWordsValidator} from '../../../../validators/forbidden-words.validator';
import {DatePipe, NgClass} from "@angular/common";
import {InputErrorComponent} from "../../../shared/ui-components/input-error/input-error.component";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker
} from "@angular/material/datepicker";
import {HackathonService} from "../../../core/services/hackathon.service";
import {IHackathonDto} from "../../../core/models/hackathonDto";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";

@Component({
  selector: 'app-create-edit-hackathon',
  standalone: true,
  imports: [
    PaginatorModule,
    ReactiveFormsModule,
    TypeProjectComponent,
    NgClass,
    InputErrorComponent,
    MatFormField,
    MatDatepickerToggle,
    MatDateRangeInput,
    MatDateRangePicker,
    MatLabel,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule
  ],
  providers: [DatePipe],
  templateUrl: './create-edit-hackathon.component.html',
  styleUrl: './create-edit-hackathon.component.scss'
})
export class CreateEditHackathonComponent {

  private hackathonService = inject(HackathonService);
  form!: FormGroup;
  submitAttempted = false;
  isError: boolean = false;
  oldNickname: string = '';
  cancel_btn: boolean = false;
  projectData: any = null;
  isLoading = false;
  imageLink: any;
  errorMessages: string = '';

  private id = toSignal(
    this.route.paramMap.pipe(
      map(params => Number(params.get('id')))
    ),
    { initialValue: 0 }
  );

  constructor(private fb: FormBuilder, private router: Router,
              private createEditProjectsService: CreateEditProjectsService,
              private route: ActivatedRoute) {

  }
  onTextAreaInput(event: Event, minHeight = 98) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Сбрасываем высоту, чтобы она могла адаптироваться

    // Используем scrollHeight, чтобы установить высоту в зависимости от содержимого
    const newHeight = Math.max(textarea.scrollHeight, minHeight);

    textarea.style.height = `${newHeight}px`; // Устанавливаем высоту в зависимости от содержимого
  }

  ngOnInit(): void {
    this.initializeForm();
    let paramId = this.route.snapshot.paramMap.get('id');

    if (paramId) this.ProjectData(paramId);
  }

  onInputChange(event: any) {
    let value = event.target.value;

    if (!value.startsWith('@')) {
      value = '@' + value.replace(/^@+/, ''); // Убираем лишние @ в начале
      event.target.value = value; // Обновляем отображение в input
    }
  }

  initializeForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200), forbiddenWordsValidator()]],
      nickname: ['', [Validators.required, forbiddenWordsValidator()]],
      customLink: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      format: ['', [Validators.required]],
      location: ['', [Validators.required]],
      organizer: ['', [Validators.required]],
      participationConditions: ['', [Validators.required]],
      prizePool: ['', [Validators.required]],
      registrationStartDate: ['', [Validators.required]],
      registrationDeadline: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      telegram: ['', [Validators.required]],
      targetAudience: ['', [Validators.required]],
      focus: ['', [Validators.required]],
    });
  }

  @ViewChild('fileBackgroundInput') fileBackgroundInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileLogoInput') fileLogoInput!: ElementRef<HTMLInputElement>;


  isBackgroundImageSelected = false;
  isLogoImageSelected = false;

  onSelectImage(target: 'background' | 'logo'): void {
    if (target === 'background') {
      this.fileBackgroundInput.nativeElement.click();
    } else if (target === 'logo') {
      this.fileLogoInput.nativeElement.click();
    }
  }

  // Общая функция для изменения изображения
  onImageChange(event: Event, target: 'background' | 'logo'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/png', 'image/jpeg'];

      if (!allowedTypes.includes(file.type)) {
        console.error('Unsupported file type:', file.type);
        alert('Please upload a PNG or JPEG image.');
        return;
      }

      const objectUrl = URL.createObjectURL(file);

      if (target === 'background') {
        const backgroundContainer = document.querySelector('.background-container') as HTMLElement;
        if (backgroundContainer) {
          backgroundContainer.style.backgroundImage = `url(${objectUrl})`;
          backgroundContainer.style.backgroundSize = 'cover';
          backgroundContainer.style.backgroundPosition = 'center';
        }
        this.imageLink = file;
        this.isLogoImageSelected = true;
      } else if (target === 'logo') {
        const logoContainer = document.querySelector('.container-elements-left-iconBlock-img') as HTMLElement;
        if (logoContainer) {
          logoContainer.style.backgroundImage = `url(${objectUrl})`;
          logoContainer.style.backgroundSize = 'contain';
          logoContainer.style.backgroundRepeat = 'no-repeat';
          logoContainer.style.backgroundPosition = 'center';
        }
        this.isLogoImageSelected = true;
      }

      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    }
  }


  setAvatar(file: any, endpoint: string): void {
    const formData = new FormData();
    formData.append('avatar', file);

    this.createEditProjectsService.setAvatar(formData, endpoint, this.projectData.id).subscribe({
      next: (response) => {
        console.log('Avatar updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating avatar:', error);
      }
    });
  }

  ProjectData(nicknameProject: string) {
    this.hackathonService.getCurrentHackathon(nicknameProject).subscribe(
      (hackathon: IHackathonDto) => {
        this.projectData = hackathon;
        this.form.patchValue({
          title: hackathon.title || '',
          customLink: hackathon.customLink || '',
          startDate: new Date(hackathon.startDate * 1000) || '',
          endDate: new Date(hackathon.endDate * 1000) || '',
          registrationDeadline: new Date(hackathon.registrationDeadline * 1000) || '',
          registrationStartDate: new Date(hackathon.registrationStartDate * 1000) || '',
          focus: hackathon.focus || '',
          telegram: hackathon.telegram ? '@' + hackathon.telegram.replace(/^@+/, '') : '',
          format: hackathon.format || '',
          hackathonLink: hackathon.hackathonLink || '',
          imageLink: hackathon.imageLink,
          nickname: hackathon.nickname,
          location: hackathon.location,
          organizer: hackathon.organizer,
          participationConditions: hackathon.participationConditions,
          prizePool: hackathon.prizePool,
          registrationStatus: hackathon.registrationStatus,
          shortDescription: hackathon.shortDescription,
          targetAudience: hackathon.targetAudience,
        });

        if (hackathon.nickname) {
          this.oldNickname = hackathon.nickname;
        }
        this.form.get('nickname')?.valueChanges.subscribe(value => {
          if (value !== this.oldNickname && value.length > 0) {
            this.forbiddenWordsValidator(value)
          }
        });
        this.formChanges();
      },
      (error: any) => {
        console.error('Ошибка при загрузке данных пользователя:', error);
        console.log('error.status', error)
        if (error.status) {
          this.router.navigate(['/error', error.status.toString()]);
        } else {
          this.router.navigate(['/error', { num: "500" }]);
        }
      }
    );
  }

  formChanges() {
    this.form.valueChanges.subscribe((changes) => {
      if (this.areAllFieldsEmpty()) {
        this.cancel_btn = false;
      }
      else {
        this.cancel_btn = true;
      }
    });
  }

  areAllFieldsEmpty(): boolean {
    return Object.values(this.form.value).every(value => value === '');
  }

  onTagsChanged(tags: any, field: string): void {
    this.form.get(field)?.setValue(tags);
  }

  formatDate(date: string): string {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  submitForm(): void {
    const isEdit = !!this.projectData;
    this.submitAttempted = true;
    this.isLoading = true;

    this.form.value.startDate = this.formatDate(this.form.value.startDate);
    this.form.value.endDate = this.formatDate(this.form.value.endDate);
    this.form.value.registrationStartDate = this.formatDate(this.form.value.registrationStartDate);
    this.form.value.registrationDeadline = this.formatDate(this.form.value.registrationDeadline);

    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      control?.markAsDirty();
      control?.markAsTouched();
    });

    if (this.form.valid) {
      let data = this.form.getRawValue();
      let newData: IHackathonDto = {
        ...data,
        title: data.title || '',
        format: data.format?.type || '',
        telegram: data.telegram ? data.telegram.startsWith('@') ? data.telegram.slice(1) : data.telegram : '',
        shortDescription: data.shortDescription ? data.shortDescription.replace(/\r?\n/g, '\n') : '',
        nickname: data.nickname || '',
        registrationSuspended: true,
        registrationStatus: "OPEN"
      };

      if (isEdit) {
        newData.id = this.id();
        this.hackathonService.editHackathon(newData, this.id()).subscribe((data: any) => {
          if (this.imageLink) {
            this.setAvatar(this.imageLink, 'image');
          }
          void this.router.navigate(['project', data.nickname]);
        })
      } else {
        this.hackathonService.createHackathon(newData).subscribe((data: any) => {
          if (this.imageLink) {
            this.setAvatar(this.imageLink, 'image');
          }
          this.router.navigate(['project', data.nickname]);
        })
      }
    } else {
      this.isLoading = false;
      Object.keys(this.form.controls).forEach(key => {
        const controlErrors = this.form.get(key)!.errors;
        console.log('Поле:', key, 'Ошибки:', controlErrors);
        if (controlErrors != null && controlErrors['required']) {
          this.errorMessages = 'Заполнены не все обязательные поля';
        }
      });
    }
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!control?.hasError(error) && (control?.dirty || control?.touched || this.submitAttempted);
  }

  forbiddenWordsValidator(value: string) {
    // this.form.validatorDomain(value.toLowerCase()).subscribe((data: any) => {
    //   if (data === false) {
    //     this.form.get('nickname')?.setErrors({ forbiddenWords: true });
    //   } else {
    //     this.form.get('nickname')?.setErrors(null);
    //   }
    // })
  }
}
