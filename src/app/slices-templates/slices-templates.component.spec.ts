import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicesTemplatesComponent } from './slices-templates.component';

describe('SlicesTemplatesComponent', () => {
  let component: SlicesTemplatesComponent;
  let fixture: ComponentFixture<SlicesTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicesTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicesTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
