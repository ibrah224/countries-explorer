import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CountriesService } from './countries';

describe('CountriesService', () => {
  let service: CountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(CountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
