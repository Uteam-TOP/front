import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsNewsComponent } from './projects-news.component';

describe('ProjectsNewsComponent', () => {
  let component: ProjectsNewsComponent;
  let fixture: ComponentFixture<ProjectsNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
