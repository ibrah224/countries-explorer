import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { WikipediaService } from './wikipedia';

describe('WikipediaService', () => {
  let service: WikipediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(WikipediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
