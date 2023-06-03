import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelOrderPage } from './cancel-order.page';

describe('CancelOrderPage', () => {
  let component: CancelOrderPage;
  let fixture: ComponentFixture<CancelOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
