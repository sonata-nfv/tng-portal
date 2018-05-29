import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaTemplatesComponent } from './sla-templates.component';

describe('SlaTemplatesComponent', () => {
  let component: SlaTemplatesComponent;
  let fixture: ComponentFixture<SlaTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
