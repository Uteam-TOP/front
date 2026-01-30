import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonSortComponent } from './skeleton-sort.component';

describe('SkeletonSortComponent', () => {
  let component: SkeletonSortComponent;
  let fixture: ComponentFixture<SkeletonSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonSortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
