import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonHackathonComponent } from './skeleton-hackathon.component';

describe('SkeletonHackathonComponent', () => {
  let component: SkeletonHackathonComponent;
  let fixture: ComponentFixture<SkeletonHackathonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonHackathonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonHackathonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
