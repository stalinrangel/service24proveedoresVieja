import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonesServicePage } from './zones-service.page';

describe('ZonesServicePage', () => {
  let component: ZonesServicePage;
  let fixture: ComponentFixture<ZonesServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonesServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonesServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
