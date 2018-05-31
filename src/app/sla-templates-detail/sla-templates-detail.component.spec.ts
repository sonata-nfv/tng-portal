import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaTemplatesDetailComponent } from './sla-templates-detail.component';

describe('SlaTemplatesDetailComponent', () => {
  let component: SlaTemplatesDetailComponent;
  let fixture: ComponentFixture<SlaTemplatesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaTemplatesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaTemplatesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
