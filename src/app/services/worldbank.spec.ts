import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { WorldBankService } from './worldbank';

describe('WorldBankService', () => {
  let service: WorldBankService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(WorldBankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
