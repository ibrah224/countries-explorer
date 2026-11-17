import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Facts } from './facts';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('Facts', () => {
  let component: Facts;
  let fixture: ComponentFixture<Facts>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Facts],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(Facts);
    component = fixture.componentInstance;

    fixture.detectChanges();

    httpTestingController.expectOne('/countries.json').flush([]);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
