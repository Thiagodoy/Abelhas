import { TestBed, inject } from '@angular/core/testing';

import { MomentService } from './moment.service';

describe('MomentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MomentService]
    });
  });

  it('should ...', inject([MomentService], (service: MomentService) => {
    expect(service).toBeTruthy();
  }));
});
