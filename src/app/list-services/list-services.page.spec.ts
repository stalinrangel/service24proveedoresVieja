import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListServicesPage } from './list-services.page';

describe('ListServicesPage', () => {
  let component: ListServicesPage;
  let fixture: ComponentFixture<ListServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListServicesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
