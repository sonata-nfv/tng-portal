import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicesInstancesComponent } from './slices-instances.component';

describe('SlicesInstancesComponent', () => {
  let component: SlicesInstancesComponent;
  let fixture: ComponentFixture<SlicesInstancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicesInstancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicesInstancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
