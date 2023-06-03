import { TestBed } from '@angular/core/testing';

import { ObjectserviceService } from './objectservice.service';

describe('ObjectserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjectserviceService = TestBed.get(ObjectserviceService);
    expect(service).toBeTruthy();
  });
});
