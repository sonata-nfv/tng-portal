import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ServiceLicencesComponent } from "./service-licences.component";

describe("ServiceLicencesComponent", () => {
  let component: ServiceLicencesComponent;
  let fixture: ComponentFixture<ServiceLicencesComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ServiceLicencesComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceLicencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
