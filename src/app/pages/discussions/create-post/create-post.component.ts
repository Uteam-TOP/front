import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputErrorComponent} from "../../../shared/ui-components/input-error/input-error.component";
import {UiButtonComponent} from "../../../shared/ui-components/ui-button/ui-button.component";
import {NgClass} from "@angular/common";
import {DiscussionsService} from "../../../core/services/discussions.service";
import {MatDialog} from "@angular/material/dialog";
import {SuccessModalComponent} from "../../../shared/modals/success-modal/success-modal.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    InputErrorComponent,
    ReactiveFormsModule,
    UiButtonComponent,
    NgClass
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  private fb = inject(FormBuilder);
  private discussionService = inject(DiscussionsService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  isLoading: boolean = false;
  errorMessages: string = '';

  form!: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(250)]],
      text: ['', [Validators.required, Validators.maxLength(5000)]],
    })
  }

  submitForm() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.discussionService.addPost(this.form.value).subscribe(result => {
        let dialogRef = this.dialog.open(SuccessModalComponent, {
          height: '250px',
          width: '450px',
          data: {title: '', text: 'Пост успешно создан'},
        });

        dialogRef.afterClosed().subscribe(result => {
          void this.router.navigate(['/discussions/list']);
        })
      })
    }
  }


}
