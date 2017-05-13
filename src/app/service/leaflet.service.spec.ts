/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletService } from './leaflet.service';

describe('LeafletService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeafletService]
    });
  });

  it('should ...', inject([LeafletService], (service: LeafletService) => {
    expect(service).toBeTruthy();
  }));
});
