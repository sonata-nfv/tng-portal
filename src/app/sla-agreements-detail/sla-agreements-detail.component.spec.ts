import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaAgreementsDetailComponent } from './sla-agreements-detail.component';

describe('SlaAgreementsDetailComponent', () => {
  let component: SlaAgreementsDetailComponent;
  let fixture: ComponentFixture<SlaAgreementsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaAgreementsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaAgreementsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
