import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseSectionComponent } from './base-section.component';

describe('BaseSectionComponent', () => {
  let component: BaseSectionComponent;
  let fixture: ComponentFixture<BaseSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
