import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyNumberPage } from './verify-number.page';

describe('VerifyNumberPage', () => {
  let component: VerifyNumberPage;
  let fixture: ComponentFixture<VerifyNumberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyNumberPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyNumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
