import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SmNetworkServicesComponent } from "./sm-network-services.component";

describe("SmNetworkServicesComponent", () => {
  let component: SmNetworkServicesComponent;
  let fixture: ComponentFixture<SmNetworkServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmNetworkServicesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmNetworkServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
