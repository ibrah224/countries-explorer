
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation';

interface Tile {
  icon: string;
  label: string;
  link: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  translation = inject(TranslationService);

  get tiles(): Tile[] {
    const labels = {
      fr: ['Pays', 'Recherche', 'Carte', 'Faits', 'Régions', 'Langues', 'Argent', 'Quiz'],
      en: ['Countries', 'Search', 'Map', 'Facts', 'Regions', 'Languages', 'Currencies', 'Quiz'],
      ar: ['الدول', 'بحث', 'الخريطة', 'حقائق', 'المناطق', 'اللغات', 'العملات', 'اختبار'],
      zh: ['国家', '搜索', '地图', '事实', '地区', '语言', '货币', '测验']
    };

    const icons = ['🌐', '🔎', '🗺️', '📊', '🧭', '🗣️', '💱', '🧩'];
    const links = ['/countries', '/search', '/world-map', '/facts', '/explore/regions', '/explore/languages', '/explore/currencies', '/quiz'];

    return icons.map((icon, i) => ({
      icon,
      label: labels[this.translation.lang()][i],
      link: links[i]
    }));
  }

  get title(): string {
    return {
      fr: 'Pays du Monde',
      en: 'Countries of the World',
      ar: 'دول العالم',
      zh: '世界各国'
    }[this.translation.lang()];
  }

  get subtitle(): string {
    return {
      fr: 'Explore tous les pays de la planète',
      en: 'Explore every country on the planet',
      ar: 'استكشف جميع دول الكوكب',
      zh: '探索地球上的所有国家'
    }[this.translation.lang()];
  }
}
