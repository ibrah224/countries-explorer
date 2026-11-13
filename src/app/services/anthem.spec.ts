import { TestBed } from '@angular/core/testing';
import { Anthem } from './anthem';

describe('Anthem', () => {
  let service: Anthem;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anthem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
