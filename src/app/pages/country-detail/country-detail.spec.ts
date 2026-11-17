import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountryDetail } from './country-detail';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('CountryDetail', () => {
  let component: CountryDetail;
  let fixture: ComponentFixture<CountryDetail>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryDetail],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(CountryDetail);
    component = fixture.componentInstance;

    fixture.detectChanges();

    httpTestingController.expectOne('/countries.json').flush([]);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
