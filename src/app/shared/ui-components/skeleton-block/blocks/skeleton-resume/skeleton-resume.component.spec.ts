import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonResumeComponent } from './skeleton-resume.component';

describe('SkeletonResumeComponent', () => {
  let component: SkeletonResumeComponent;
  let fixture: ComponentFixture<SkeletonResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
