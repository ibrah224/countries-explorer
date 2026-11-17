import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CountriesService } from '../../services/countries';
import { Country } from '../../models/country';

interface Row {
  country: Country;
  value: string;
}
interface Fact {
  icon: string;
  title: string;
  rows: Row[];
}

const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

function top(
  list: Country[],
  by: (c: Country) => number,
  dir: 'desc' | 'asc',
  unit: string,
  n = 5,
): Row[] {
  return [...list]
    .sort((a, b) => (dir === 'desc' ? by(b) - by(a) : by(a) - by(b)))
    .slice(0, n)
    .map((c) => ({ country: c, value: `${nf.format(by(c))} ${unit}` }));
}

@Component({
  selector: 'app-facts',
  imports: [RouterLink],
  templateUrl: './facts.html',
  styleUrl: './facts.scss',
})
export class Facts {
  private service = inject(CountriesService);
  private countries = toSignal(this.service.getAll(), { initialValue: [] as Country[] });

  facts = computed<Fact[]>(() => {
    const all = this.countries();
    if (!all.length) return [];

    const withPop = all.filter((c) => c.population > 0);
    const withArea = all.filter((c) => (c.area?.kilometers ?? 0) > 0);
    const area = (c: Country) => c.area.kilometers;
    const density = (c: Country) => c.population / c.area.kilometers;

    return [
      {
        icon: '👥',
        title: 'Les plus peuplés',
        rows: top(withPop, (c) => c.population, 'desc', 'hab.'),
      },
      {
        icon: '🔬',
        title: 'Les moins peuplés',
        rows: top(withPop, (c) => c.population, 'asc', 'hab.'),
      },
      { icon: '📏', title: 'Les plus grands', rows: top(withArea, area, 'desc', 'km²') },
      { icon: '📍', title: 'Les plus petits', rows: top(withArea, area, 'asc', 'km²') },
      {
        icon: '🏙️',
        title: 'Les plus denses',
        rows: top(
          withArea.filter((c) => c.population > 0),
          density,
          'desc',
          'hab./km²',
        ),
      },
      {
        icon: '🧱',
        title: 'Le plus de frontières',
        rows: top(all, (c) => c.borders?.length ?? 0, 'desc', 'pays'),
      },
      {
        icon: '🗣️',
        title: 'Le plus de langues',
        rows: top(all, (c) => c.languages?.length ?? 0, 'desc', 'langues'),
      },
      {
        icon: '🕐',
        title: 'Le plus de fuseaux horaires',
        rows: top(all, (c) => c.timezones?.length ?? 0, 'desc', 'fuseaux'),
      },
    ];
  });
}
