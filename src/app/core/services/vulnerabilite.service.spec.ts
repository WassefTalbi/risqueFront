import { TestBed } from '@angular/core/testing';

import { VulnerabiliteService } from './vulnerabilite.service';

describe('VulnerabiliteService', () => {
  let service: VulnerabiliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VulnerabiliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
