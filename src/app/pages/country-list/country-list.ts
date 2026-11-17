import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CountriesService } from '../../services/countries';
import { Country } from '../../models/country';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-country-list',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './country-list.html',
  styleUrl: './country-list.scss',
})
export class CountryList {
  private service = inject(CountriesService);
  translation = inject(TranslationService);

  countries = toSignal(this.service.getAll(), { initialValue: [] as Country[] });
  search = signal('');
  region = signal('');

  get labels() {
    return {
      fr: {
        back: '← Accueil',
        title: 'Pays du Monde',
        search: 'Rechercher un pays ou une capitale…',
        all: 'Toutes les régions',
        country: 'pays',
        inhabitants: 'hab.',
        empty: 'Aucun résultat.',
      },
      en: {
        back: '← Home',
        title: 'Countries of the World',
        search: 'Search for a country or capital…',
        all: 'All regions',
        country: 'countries',
        inhabitants: 'inh.',
        empty: 'No results.',
      },
      ar: {
        back: '← الرئيسية',
        title: 'دول العالم',
        search: 'ابحث عن دولة أو عاصمة…',
        all: 'جميع المناطق',
        country: 'دول',
        inhabitants: 'نسمة',
        empty: 'لا توجد نتائج.',
      },
      zh: {
        back: '← 首页',
        title: '世界各国',
        search: '搜索国家或首都…',
        all: '所有地区',
        country: '个国家',
        inhabitants: '人',
        empty: '没有结果。',
      },
    }[this.translation.lang()];
  }

  get regionNames() {
    return {
      fr: ['Afrique', 'Amérique', 'Asie', 'Europe', 'Océanie', 'Antarctique'],
      en: ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic'],
      ar: ['أفريقيا', 'الأمريكتان', 'آسيا', 'أوروبا', 'أوقيانوسيا', 'القارة القطبية الجنوبية'],
      zh: ['非洲', '美洲', '亚洲', '欧洲', '大洋洲', '南极洲'],
    }[this.translation.lang()];
  }

  regionLabel(region: string): string {
    const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic'];
    return this.regionNames[regions.indexOf(region)] || region;
  }

  regions = computed(() =>
    [
      ...new Set(
        this.countries()
          .map((c) => c.region)
          .filter(Boolean),
      ),
    ].sort(),
  );

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const r = this.region();

    return this.countries().filter(
      (c) =>
        (!r || c.region === r) &&
        (!q ||
          c.names.common.toLowerCase().includes(q) ||
          c.capitals?.some((cap) => cap.name.toLowerCase().includes(q))),
    );
  });
}
