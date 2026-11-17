import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslationService, Language } from './services/translation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  translation = inject(TranslationService);

  changeLanguage(event: Event): void {
    const language = (event.target as HTMLSelectElement).value as Language;
    this.translation.setLanguage(language);
  }
  get isArabic(): boolean {
    return this.translation.lang() === 'ar';
  }
}
