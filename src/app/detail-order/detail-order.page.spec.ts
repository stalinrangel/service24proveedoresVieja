import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailOrderPage } from './detail-order.page';

describe('DetailOrderPage', () => {
  let component: DetailOrderPage;
  let fixture: ComponentFixture<DetailOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
