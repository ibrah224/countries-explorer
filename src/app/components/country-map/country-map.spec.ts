import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountryMap } from './country-map';

describe('CountryMap', () => {
  let component: CountryMap;
  let fixture: ComponentFixture<CountryMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryMap],
    }).compileComponents();

    fixture = TestBed.createComponent(CountryMap);

    fixture.componentRef.setInput('lat', 9.537);
    fixture.componentRef.setInput('lng', -13.6785);

    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
