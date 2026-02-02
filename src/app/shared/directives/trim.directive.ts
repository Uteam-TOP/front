import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][trimOnInput], [formControl][trimOnInput], [ngModel][trimOnInput]',
  standalone: true
})
export class TrimOnInputDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    if (this.ngControl.value !== value.trim()) {
      this.ngControl.control?.setValue(value.trim(), { emitEvent: false });
    }
  }
}
