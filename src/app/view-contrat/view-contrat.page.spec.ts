import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContratPage } from './view-contrat.page';

describe('ViewContratPage', () => {
  let component: ViewContratPage;
  let fixture: ComponentFixture<ViewContratPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContratPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContratPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
