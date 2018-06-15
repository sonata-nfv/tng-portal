import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaAgreementsComponent } from './sla-agreements.component';

describe('SlaAgreementsComponent', () => {
  let component: SlaAgreementsComponent;
  let fixture: ComponentFixture<SlaAgreementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaAgreementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaAgreementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
