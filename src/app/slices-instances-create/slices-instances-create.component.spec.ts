import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicesInstancesCreateComponent } from './slices-instances-create.component';

describe('SlicesInstancesCreateComponent', () => {
  let component: SlicesInstancesCreateComponent;
  let fixture: ComponentFixture<SlicesInstancesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicesInstancesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicesInstancesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
