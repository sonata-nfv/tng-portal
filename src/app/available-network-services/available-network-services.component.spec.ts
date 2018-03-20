import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableNetworkServicesComponent } from './available-network-services.component';

describe('AvailableNetworkServicesComponent', () => {
  let component: AvailableNetworkServicesComponent;
  let fixture: ComponentFixture<AvailableNetworkServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableNetworkServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableNetworkServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
