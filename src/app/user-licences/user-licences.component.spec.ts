import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLicencesComponent } from './user-licences.component';

describe('UserLicencesComponent', () => {
  let component: UserLicencesComponent;
  let fixture: ComponentFixture<UserLicencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLicencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLicencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
