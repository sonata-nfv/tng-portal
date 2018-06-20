import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SmNetworkServicesDetailComponent } from "./sm-network-services-detail.component";

describe("SmNetworkServicesDetailComponent", () => {
  let component: SmNetworkServicesDetailComponent;
  let fixture: ComponentFixture<SmNetworkServicesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmNetworkServicesDetailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmNetworkServicesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
