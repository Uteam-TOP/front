import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss'
})
export class UiButtonComponent implements OnChanges {
  @Input() text: string = '';
  @Input() type: 'arrow' | 'edit' | 'add' | 'default' | 'border' | 'green' | 'green-border' = 'default';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  public className: any = '';

  ngOnChanges(changes: SimpleChanges) {
    this.className = `type-${this.type} size-${this.size}`;
  }
}
