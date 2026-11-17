import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AnthemService } from './anthem';

describe('AnthemService', () => {
  let service: AnthemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(AnthemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
