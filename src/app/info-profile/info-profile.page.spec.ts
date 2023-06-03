import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoProfilePage } from './info-profile.page';

describe('InfoProfilePage', () => {
  let component: InfoProfilePage;
  let fixture: ComponentFixture<InfoProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
