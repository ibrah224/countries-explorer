import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Explore } from './explore';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('Explore', () => {
  let component: Explore;
  let fixture: ComponentFixture<Explore>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Explore],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(Explore);
    component = fixture.componentInstance;

    fixture.detectChanges();

    httpTestingController.expectOne('/countries.json').flush([]);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
