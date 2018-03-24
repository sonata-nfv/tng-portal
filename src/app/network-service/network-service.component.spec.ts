import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NetworkServiceComponent } from "./network-service.component";

describe("NetworkServiceComponent", () => {
  let component: NetworkServiceComponent;
  let fixture: ComponentFixture<NetworkServiceComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [NetworkServiceComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
