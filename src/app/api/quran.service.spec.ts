import { TestBed } from '@angular/core/testing';

import { QuranService } from './quran.service';

describe('QuranService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuranService = TestBed.get(QuranService);
    expect(service).toBeTruthy();
  });
});
