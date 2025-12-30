import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {UiButtonComponent} from "../../shared/ui-components/ui-button/ui-button.component";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    RouterLink,
    UiButtonComponent
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
