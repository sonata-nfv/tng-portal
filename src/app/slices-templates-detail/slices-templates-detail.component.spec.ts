import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicesTemplatesDetailComponent } from './slices-templates-detail.component';

describe('SlicesTemplatesDetailComponent', () => {
  let component: SlicesTemplatesDetailComponent;
  let fixture: ComponentFixture<SlicesTemplatesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicesTemplatesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicesTemplatesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
