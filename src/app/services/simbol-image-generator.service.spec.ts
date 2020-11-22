import { TestBed } from '@angular/core/testing';

import { SimbolImageGeneratorService } from './simbol-image-generator.service';

describe('SimbolImageGeneratorService', () => {
  let service: SimbolImageGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimbolImageGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
