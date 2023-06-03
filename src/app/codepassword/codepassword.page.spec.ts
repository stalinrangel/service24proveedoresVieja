import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodepasswordPage } from './codepassword.page';

describe('CodepasswordPage', () => {
  let component: CodepasswordPage;
  let fixture: ComponentFixture<CodepasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodepasswordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodepasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
