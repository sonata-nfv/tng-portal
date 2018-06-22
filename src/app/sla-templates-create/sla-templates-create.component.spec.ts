import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaTemplatesCreateComponent } from './sla-templates-create.component';

describe('SlaTemplatesCreateComponent', () => {
  let component: SlaTemplatesCreateComponent;
  let fixture: ComponentFixture<SlaTemplatesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaTemplatesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaTemplatesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
