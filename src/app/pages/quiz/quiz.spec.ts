import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Quiz } from './quiz';
import { provideRouter } from '@angular/router';

describe('Quiz', () => {
  let component: Quiz;
  let fixture: ComponentFixture<Quiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Quiz],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Quiz);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
