import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorldMap } from './world-map';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('WorldMap', () => {
  let component: WorldMap;
  let fixture: ComponentFixture<WorldMap>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldMap],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(WorldMap);
    component = fixture.componentInstance;

    fixture.detectChanges();

    httpTestingController.expectOne('/countries.json').flush([]);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
