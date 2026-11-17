import { Injectable, signal } from '@angular/core';

export type Language = 'fr' | 'en' | 'ar' | 'zh';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  lang = signal<Language>('fr');

  translations = {
    fr: {
      language: 'Langue',
      footer: 'Données : REST Countries · Banque mondiale · Wikipédia · OpenStreetMap',
    },
    en: {
      language: 'Language',
      footer: 'Data: REST Countries · World Bank · Wikipedia · OpenStreetMap',
    },
    ar: {
      language: 'اللغة',
      footer: 'البيانات: REST Countries · البنك الدولي · ويكيبيديا · OpenStreetMap',
    },
    zh: {
      language: '语言',
      footer: '数据：REST Countries · 世界银行 · 维基百科 · OpenStreetMap',
    },
  };

  setLanguage(language: Language): void {
    this.lang.set(language);
  }

  t(key: 'language' | 'footer'): string {
    return this.translations[this.lang()][key];
  }
}
