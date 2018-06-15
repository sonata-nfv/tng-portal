import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NetworkServiceInstancesComponent } from "./network-service-instances.component";

describe("NetworkServiceInstancesComponent", () => {
  let component: NetworkServiceInstancesComponent;
  let fixture: ComponentFixture<NetworkServiceInstancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkServiceInstancesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkServiceInstancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
