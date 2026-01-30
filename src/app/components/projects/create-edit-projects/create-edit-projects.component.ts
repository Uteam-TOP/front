import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TypeProjectComponent } from './type-project/type-project.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateEditProjectsService } from './create-edit-projects.service';
import { ProjectService } from '../project/project.service';
import { forbiddenWordsValidator } from '../../../../validators/forbidden-words.validator';
import {TagSelectedLevelComponent} from "../../form-components/tag-selected-level/tag-selected-level.component";
import {PersonalDataService} from "../../personal-account/personal-data/personal-data.service";

@Component({
  selector: 'app-create-edit-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TypeProjectComponent, TagSelectedLevelComponent],
  templateUrl: './create-edit-projects.component.html',
  styleUrl: './create-edit-projects.component.css'
})
export class CreateEditProjectsComponent implements OnInit {

  form!: FormGroup;
  submitAttempted = false;
  isError: boolean = false;
  oldNickname: string = '';
  cancel_btn: boolean = false;
  projectData: any = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private createEditProjectsService: CreateEditProjectsService,
    public projectService: ProjectService,
    private route: ActivatedRoute,
    public personalDataService: PersonalDataService
  ) {

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
    this.projectService.currentProjectData$.subscribe((value: any) => {
      this.projectData = value;
    })
    this.route.data.subscribe((data) => {
      const isEdit = data['edit'];
      if (isEdit) {
        if (this.projectData && this.projectData.nickname) {
          this.ProjectData(this.projectData.nickname);
        } else {
          const paramNickName = this.route.snapshot.paramMap.get('nickname');
          if (paramNickName) {
            this.projectService.getCurrentProject(paramNickName).subscribe(data => {
              this.projectService.setCurrentProjectData(data);
              this.ProjectData(data.nickname);
            });

          }
        }
      }
    });


  }

  onInputChange(event: any) {
    let value = event.target.value;

    // Если поле пустое или первый символ не @, добавляем его
    if (!value.startsWith('@')) {
      value = '@' + value.replace(/^@+/, ''); // Убираем лишние @ в начале
      event.target.value = value; // Обновляем отображение в input
    }
  }

  initializeForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200), forbiddenWordsValidator()]],
      summary: ['', [Validators.required, Validators.maxLength(300), forbiddenWordsValidator()]],
      type: [, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telegram: ['', [Validators.required, forbiddenWordsValidator()]],
      description: ['', [Validators.required, Validators.maxLength(1500), forbiddenWordsValidator()]],
      developmentStage: ['', [Validators.required, Validators.maxLength(1500), forbiddenWordsValidator()]],
      tasks: ['', [Validators.required, Validators.maxLength(1500), forbiddenWordsValidator()]],
      nickname: ['', [Validators.required, forbiddenWordsValidator()]],
      stack: [[]]
    });

    this.form.valueChanges.subscribe(() => {
      this.isLoading = false;
      this.errorMessage = '';
    })
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
  headerImg: any;
  avatarImg: any;

  // Общая функция для изменения изображения
  onImageChange(event: Event, target: 'background' | 'logo'): void {
    this.errorMessage = '';
    this.isLoading = false;
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
        console.log('file', file)
        this.headerImg = file;
        this.isLogoImageSelected = true;
      } else if (target === 'logo') {
        const logoContainer = document.querySelector('.container-elements-left-iconBlock-img') as HTMLElement;
        if (logoContainer) {
          logoContainer.style.backgroundImage = `url(${objectUrl})`;
          logoContainer.style.backgroundSize = 'contain';
          logoContainer.style.backgroundRepeat = 'no-repeat';
          logoContainer.style.backgroundPosition = 'center';
        }
        this.avatarImg = file;
        this.isLogoImageSelected = true;
      }

      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    }
  }


  setAvatar(file: any, endpoint: string, id: number): void {
    const formData = new FormData();
    formData.append('avatar', file);

    this.createEditProjectsService.setAvatar(formData, endpoint, id).subscribe({
      next: (response) => {
        console.log('Avatar updated successfully:', response);
      },
      error: (error) => {
        this.errorMessage = 'Изображение слишком большое'
        console.error('Error updating avatar:', error);
      }
    });
  }

  ProjectData(nicknameProject: string) {
    this.projectService.getCurrentProject(nicknameProject).subscribe(
      (user: any) => {

        this.form.patchValue({
          title: user.title || '',
          summary: user.summary || '',
          type: user.type || '',
          email: user.email || '',
          telegram: user.telegram ? '@' + user.telegram.replace(/^@+/, '') : '',
          description: user.description || '',
          developmentStage: user.developmentStage || '',
          tasks: user.tasks,
          nickname: user.nickname,
          stack: user.stack,
        });
        this.projectService.isEditProject = true;
        const backgroundContainer = document.querySelector('.background-container') as HTMLElement;
        if (backgroundContainer) {
          backgroundContainer.style.backgroundImage = `url(${user.headerLink})`;
          backgroundContainer.style.backgroundSize = 'cover';
          backgroundContainer.style.backgroundPosition = 'center';
        }
        this.headerImg = user.headerLink;
        this.isLogoImageSelected = true;
        const logoContainer = document.querySelector('.container-elements-left-iconBlock-img') as HTMLElement;
        if (logoContainer) {
          logoContainer.style.backgroundImage = `url(${user.avatarLink})`;
          logoContainer.style.backgroundSize = 'contain';
          logoContainer.style.backgroundRepeat = 'no-repeat';
          logoContainer.style.backgroundPosition = 'center';
        }
        this.avatarImg = user.avatarLink;

        if (user.nickname) {
          this.oldNickname = user.nickname;
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
    this.isLoading = false;
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

  submitForm(isEdit: boolean): void {
    this.submitAttempted = true;
    this.isLoading = true;

    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      control?.markAsDirty();
      control?.markAsTouched();
    });

    if (this.form.valid && !this.errorMessage) {

      let data = this.form.value
      let newData: {
        id?: any;
        title: any;
        summary: any;
        type: any;
        email: any;
        telegram: any;
        description: any;
        developmentStage: any;
        tasks: any;
        nickname: any;
        stack: any[];
      } = {
        'title': data.title,
        'summary': data.summary,
        'type': data.type.type,
        'email': data.email,
        'telegram': data.telegram.startsWith('@') ? data.telegram.slice(1) : data.telegram,
        'description': data.description.replace(/\r?\n/g, '\n'),
        'developmentStage': data.developmentStage.replace(/\r?\n/g, '\n'),
        'tasks': data.tasks.replace(/\r?\n/g, '\n'),
        'nickname': data.nickname,
        'stack': data.stack,

      };

      if (isEdit) {
        newData.id = this.projectData.id;
        this.createEditProjectsService.setEditProject(newData).subscribe((data: any) => {

          if (this.isValidFile(this.headerImg)) {
            this.setAvatar(this.headerImg, 'header', data.id);
          }
          if (this.isValidFile(this.avatarImg)) {
            this.setAvatar(this.avatarImg, 'avatar', data.id);
          }
          this.projectService.setCurrentProjectData(data);

          // this.router.navigateByUrl(`/project/${data.nickname}`);

          setTimeout(() => {
            if (!this.errorMessage) {
              this.router.navigate(['project', data.nickname]);
            }
          }, 1000);

        },
        (error: any) => {
          console.log('error', error);
          this.isLoading = false;
          this.errorMessage = error.error.userMessage;
        })
      } else {
        this.createEditProjectsService.setNewProject(newData).subscribe((data: any) => {

          if (this.isValidFile(this.headerImg)) {
            this.setAvatar(this.headerImg, 'header', data.id);
          }
          if (this.isValidFile(this.avatarImg)) {
            this.setAvatar(this.avatarImg, 'avatar', data.id);
          }
          this.projectService.setCurrentProjectData(data);
          this.isLoading = true;
          setTimeout(() => {
            if (!this.errorMessage) {
              this.router.navigate(['project', data.nickname]);
            }
          }, 1000);

        },
        (error: any) => {
          console.log('error', error);
          this.isLoading = false;
          this.errorMessage = error.error.userMessage;
        })
      }
      this.projectService.isEditProject = false;


    } else {
      console.log('Форма содержит ошибки:', this.form.errors);
      this.form.markAllAsTouched();
    }
  }




  private isValidFile(file: any): boolean {
    // Исключаем строки

    if (typeof file === 'string') {
      return false;
    }

    // Проверяем основные признаки файла
    if (file instanceof File) {
      return file.size !== 0 && !!file.name && !!file.type;
    }

    if (file instanceof Blob) {
      return file.size !== 0;
    }

    // Проверка по структуре объекта
    if (file && typeof file === 'object') {
      const hasFileProperties = 'name' in file && 'size' in file && 'type' in file;
      const hasBlobProperties = 'size' in file && 'type' in file;

      return (hasFileProperties || hasBlobProperties) && file.size !== 0;
    }

    return false;
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
