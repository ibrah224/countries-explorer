import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs';
import { Country } from '../models/country';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private http = inject(HttpClient);
  private countries$ = this.http.get<Country[]>('/countries.json').pipe(shareReplay(1));

  getAll() {
    return this.countries$;
  }

  getByCode(code: string) {
    return this.countries$.pipe(
      map((list) => list.find((c) => c.codes.alpha_3 === code.toUpperCase())),
    );
  }
}
