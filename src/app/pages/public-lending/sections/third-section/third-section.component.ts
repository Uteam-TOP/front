import {ChangeDetectionStrategy, Component, EventEmitter, inject, Output} from '@angular/core';
import { LendingFooterButtonComponent } from "../lending-footer-button/lending-footer-button.component";
import { BaseSectionComponent } from "../base-section/base-section.component";
import {NgOptimizedImage} from "@angular/common";
import {HomeService} from "../../../../components/home/home.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-third-section',
  standalone: true,
  imports: [LendingFooterButtonComponent, NgOptimizedImage],
  templateUrl: './third-section.component.html',
  styleUrl: './third-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThirdSectionComponent extends BaseSectionComponent {
  @Output() pageLink = new EventEmitter();

  goToPage(url: string[], type?: string):void {
    this.pageLink.emit({url, type});
  }
}
