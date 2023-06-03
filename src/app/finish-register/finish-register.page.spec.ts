import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishRegisterPage } from './finish-register.page';

describe('FinishRegisterPage', () => {
  let component: FinishRegisterPage;
  let fixture: ComponentFixture<FinishRegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishRegisterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
