import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonVacancyComponent } from './skeleton-vacancy.component';

describe('SkeletonVacancyComponent', () => {
  let component: SkeletonVacancyComponent;
  let fixture: ComponentFixture<SkeletonVacancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonVacancyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
