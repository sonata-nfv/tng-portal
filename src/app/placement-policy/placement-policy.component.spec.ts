import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PlacementPolicyComponent } from "./placement-policy.component";

describe("PlacementPolicyComponent", () => {
  let component: PlacementPolicyComponent;
  let fixture: ComponentFixture<PlacementPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlacementPolicyComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
