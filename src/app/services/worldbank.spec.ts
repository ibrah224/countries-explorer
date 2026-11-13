import { TestBed } from '@angular/core/testing';
import { Worldbank } from './worldbank';

describe('Worldbank', () => {
  let service: Worldbank;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Worldbank);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
