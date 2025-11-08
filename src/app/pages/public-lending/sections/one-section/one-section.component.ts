import { Component } from '@angular/core';
import {BaseSectionComponent} from "../base-section/base-section.component";

@Component({
  selector: 'app-one-section',
  standalone: true,
  imports: [],
  templateUrl: './one-section.component.html',
  styleUrl: './one-section.component.css'
})
export class OneSectionComponent extends BaseSectionComponent {}
