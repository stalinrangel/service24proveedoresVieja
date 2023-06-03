import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSupportPage } from './chat-support.page';

describe('ChatSupportPage', () => {
  let component: ChatSupportPage;
  let fixture: ComponentFixture<ChatSupportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatSupportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatSupportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
