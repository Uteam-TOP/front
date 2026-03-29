import {Component, effect, inject, input} from '@angular/core';
import {IHackathonDto} from "../../../../../core/models/hackathonDto";
import {HackathonService} from "../../../../../core/services/hackathon.service";
import {InputErrorComponent} from "../../../../../shared/ui-components/input-error/input-error.component";
import {PaginatorModule} from "primeng/paginator";
import {FormArray, FormBuilder, ReactiveFormsModule, Validators, FormControl} from "@angular/forms";
import {UiButtonComponent} from "../../../../../shared/ui-components/ui-button/ui-button.component";

@Component({
  selector: 'app-create-edit-nominations',
  standalone: true,
  imports: [
    InputErrorComponent,
    PaginatorModule,
    ReactiveFormsModule,
    UiButtonComponent,
  ],
  templateUrl: './create-edit-nominations.component.html',
  styleUrl: './create-edit-nominations.component.scss'
})
export class CreateEditNominationsComponent {
  hackathon = input.required<IHackathonDto>()
  private hackathonService = inject(HackathonService);
  private fb = inject(FormBuilder);
  public form = this.fb.array([
    this.fb.group({
      name: ['', Validators.required],
      description: ['']
    })
  ]);

  constructor() {
    effect(() => {
      this.addItem('Первое место');
      this.addItem('Второе место');
      this.addItem('Третье место');
      this.removeItem(0);
    });
  }

  get controls() {
    return (this.form as FormArray).controls as FormControl[];
  }

  addItem(name: string) {
    this.form.push(this.fb.group({
      name: [name, Validators.required],
      description: ['', [Validators.required, Validators.min(1)]]
    }));
  }

  submitForm() {
    if (this.form.valid) {
      let data = [];
      this.form.value.forEach(item => {
        const itemData = {
          ...item,
          hackathon: this.hackathon(),
        }
        data.push(itemData)
      })
    }
  }

  removeItem(index: number) {
    this.form.removeAt(index);
  }

  closeNominationsForm() {
    this.hackathonService.page = 'home'
  }
}
