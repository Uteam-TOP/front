import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonProjectComponent } from './skeleton-project.component';

describe('SkeletonProjectComponent', () => {
  let component: SkeletonProjectComponent;
  let fixture: ComponentFixture<SkeletonProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
