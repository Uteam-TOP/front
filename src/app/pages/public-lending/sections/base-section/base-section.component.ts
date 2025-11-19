import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-base-section',
  standalone: true,
  imports: [],
  templateUrl: './base-section.component.html',
  styleUrl: './base-section.component.css'
})
export abstract class BaseSectionComponent {
  private resizeListener!: () => void;

  constructor(protected elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.setBackgroundContainerHeight();
    this.resizeListener = () => this.setBackgroundContainerHeight();
    window.addEventListener('resize', this.resizeListener);
  }

  private setBackgroundContainerHeight() {

    const container = this.elementRef.nativeElement.querySelector('.background-container');
    if (container) {
      const height = window.innerHeight;
      container.style.height = `${height}px`;
      container.style.maxHeight = `${height}px`;
      container.style.overflow = 'hidden';
    }
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}
