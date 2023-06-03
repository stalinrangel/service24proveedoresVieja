import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificationPage } from './calification.page';

describe('CalificationPage', () => {
  let component: CalificationPage;
  let fixture: ComponentFixture<CalificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
