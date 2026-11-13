import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, shareReplay } from 'rxjs';
import { CountriesService } from './countries';

export interface Ranking {
  label: string;
  display: string | null;
  rank: number | null;
  total: number;
  year?: string;
}

interface Row { iso3: string; value: number; year?: string }
type Format = 'usd' | 'pct' | 'years' | 'num';

const INDICATORS: { code: string; label: string; format: Format }[] = [
  { code: 'NY.GDP.MKTP.CD', label: 'PIB', format: 'usd' },
  { code: 'NY.GDP.PCAP.CD', label: 'PIB par habitant', format: 'usd' },
  { code: 'SP.DYN.LE00.IN', label: 'Espérance de vie', format: 'years' },
  { code: 'IT.NET.USER.ZS', label: 'Utilisateurs d’internet', format: 'pct' },
  { code: 'SE.ADT.LITR.ZS', label: 'Alphabétisation des adultes', format: 'pct' },
];

const compact = new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 });

function fmt(value: number, format: Format): string {
  switch (format) {
    case 'usd': return compact.format(value) + ' $';
    case 'pct': return value.toFixed(1) + ' %';
    case 'years': return value.toFixed(1) + ' ans';
    case 'num': return compact.format(value) + ' hab.';
  }
}

@Injectable({ providedIn: 'root' })
export class WorldBankService {
  private http = inject(HttpClient);
  private countries = inject(CountriesService);
  private cache = new Map<string, Observable<Row[]>>();

  private load(code: string): Observable<Row[]> {
    let obs = this.cache.get(code);
    if (!obs) {
      const url = `https://api.worldbank.org/v2/country/all/indicator/${code}?format=json&per_page=400&mrnev=1`;
      obs = forkJoin([this.http.get<any>(url), this.countries.getAll()]).pipe(
        map(([res, countries]) => {
          const valid = new Set(countries.map(c => c.codes.alpha_3));
          return ((res?.[1] ?? []) as any[])
            .filter(r => r.value !== null && valid.has(r.countryiso3code))
            .map(r => ({ iso3: r.countryiso3code, value: r.value, year: r.date }) as Row);
        }),
        catchError(() => of([] as Row[])),
        shareReplay(1)
      );
      this.cache.set(code, obs);
    }
    return obs;
  }

  private toRanking(label: string, rows: Row[], iso3: string, format: Format): Ranking {
    const sorted = [...rows].sort((a, b) => b.value - a.value);
    const i = sorted.findIndex(r => r.iso3 === iso3);
    return {
      label,
      display: i >= 0 ? fmt(sorted[i].value, format) : null,
      rank: i >= 0 ? i + 1 : null,
      total: sorted.length,
      year: i >= 0 ? sorted[i].year : undefined,
    };
  }

  getRankings(iso3: string): Observable<Ranking[]> {
    const population$ = this.countries.getAll().pipe(
      map(list =>
        this.toRanking(
          'Population',
          list.filter(c => c.population > 0).map(c => ({ iso3: c.codes.alpha_3, value: c.population })),
          iso3,
          'num'
        )
      )
    );

    const indicators$ = INDICATORS.map(ind =>
      this.load(ind.code).pipe(map(rows => this.toRanking(ind.label, rows, iso3, ind.format)))
    );

    return forkJoin([population$, ...indicators$]);
  }
}