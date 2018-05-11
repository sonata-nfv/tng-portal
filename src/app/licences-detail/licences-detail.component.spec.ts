import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicencesDetailComponent } from './licences-detail.component';

describe('LicencesDetailComponent', () => {
  let component: LicencesDetailComponent;
  let fixture: ComponentFixture<LicencesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicencesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicencesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
