import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicesInstancesDetailComponent } from './slices-instances-detail.component';

describe('SlicesInstancesDetailComponent', () => {
  let component: SlicesInstancesDetailComponent;
  let fixture: ComponentFixture<SlicesInstancesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicesInstancesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicesInstancesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
