import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePlatformComponent } from './service-platform.component';

describe('ServicePlatformComponent', () => {
  let component: ServicePlatformComponent;
  let fixture: ComponentFixture<ServicePlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicePlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
