import { TestBed } from '@angular/core/testing';

import { ValoresComunesService } from '../shared/service/valores-comunes.service';

describe('ValoresComunesService', () => {
  let service: ValoresComunesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValoresComunesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
