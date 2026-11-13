import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CountriesService } from '../../services/countries';
import { Country } from '../../models/country';

type Kind = 'regions' | 'languages' | 'currencies';

interface Group {
  key: string;
  label: string;
  countries: Country[];
}

const TITLES: Record<Kind, string> = {
  regions: 'Régions',
  languages: 'Langues',
  currencies: 'Argent',
};

@Component({
  selector: 'app-explore',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './explore.html',
  styleUrl: './explore.scss',
})
export class Explore {
  private route = inject(ActivatedRoute);
  private service = inject(CountriesService);

  all = toSignal(this.service.getAll(), { initialValue: [] as Country[] });

  type = toSignal(
    this.route.paramMap.pipe(map(p => (p.get('type') ?? 'regions') as Kind)),
    { initialValue: 'regions' as Kind }
  );

  selected = toSignal(
    this.route.queryParamMap.pipe(map(p => p.get('g'))),
    { initialValue: null as string | null }
  );

  title = computed(() => TITLES[this.type()] ?? 'Explorer');

  groups = computed<Group[]>(() => {
    const byKey = new Map<string, Group>();
    const add = (key: string, label: string, c: Country) => {
      let g = byKey.get(key);
      if (!g) {
        g = { key, label, countries: [] };
        byKey.set(key, g);
      }
      g.countries.push(c);
    };

    for (const c of this.all()) {
      switch (this.type()) {
        case 'regions': {
          const k = c.subregion || c.region;
          if (k) add(k, k, c);
          break;
        }
        case 'languages':
          for (const l of c.languages ?? []) {
            const label = l.native_name && l.native_name !== l.name ? `${l.name} (${l.native_name})` : l.name;
            add(l.name, label, c);
          }
          break;
        case 'currencies':
          for (const m of c.currencies ?? []) {
            add(m.code, `${m.name} (${m.code})`, c);
          }
          break;
      }
    }

    return [...byKey.values()].sort(
      (a, b) => b.countries.length - a.countries.length || a.label.localeCompare(b.label)
    );
  });

  current = computed(() => this.groups().find(g => g.key === this.selected()) ?? null);
}