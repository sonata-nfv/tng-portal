import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SmNetworkServiceComponent } from "./sm-network-service.component";

describe("SmNetworkServiceComponent", () => {
  let component: SmNetworkServiceComponent;
  let fixture: ComponentFixture<SmNetworkServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmNetworkServiceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmNetworkServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
