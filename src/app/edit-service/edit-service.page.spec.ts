import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServicePage } from './edit-service.page';

describe('EditServicePage', () => {
  let component: EditServicePage;
  let fixture: ComponentFixture<EditServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
