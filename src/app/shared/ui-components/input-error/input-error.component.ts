import {Component, input} from '@angular/core';
import {AbstractControl, FormControl} from "@angular/forms";

@Component({
  selector: 'app-input-error',
  standalone: true,
  imports: [],
  templateUrl: './input-error.component.html',
  styleUrl: './input-error.component.scss'
})
export class InputErrorComponent {
  formElement = input<AbstractControl<any, any> | null >();
  inputName = input<string>('');
}
