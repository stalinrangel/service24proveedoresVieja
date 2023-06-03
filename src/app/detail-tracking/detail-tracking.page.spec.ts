import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTrackingPage } from './detail-tracking.page';

describe('DetailTrackingPage', () => {
  let component: DetailTrackingPage;
  let fixture: ComponentFixture<DetailTrackingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailTrackingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTrackingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
