import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpNetworkServicesComponent } from './sp-network-services.component';

describe('SpNetworkServicesComponent', () => {
  let component: SpNetworkServicesComponent;
  let fixture: ComponentFixture<SpNetworkServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpNetworkServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpNetworkServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
