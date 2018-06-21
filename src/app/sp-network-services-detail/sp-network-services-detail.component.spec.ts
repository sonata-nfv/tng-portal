import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpNetworkServicesDetailComponent } from './sp-network-services-detail.component';

describe('SpNetworkServicesDetailComponent', () => {
  let component: SpNetworkServicesDetailComponent;
  let fixture: ComponentFixture<SpNetworkServicesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpNetworkServicesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpNetworkServicesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
