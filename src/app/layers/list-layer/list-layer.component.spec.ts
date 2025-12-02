import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLayerComponent } from './list-layer.component';

describe('ListLayerComponent', () => {
  let component: ListLayerComponent;
  let fixture: ComponentFixture<ListLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListLayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
