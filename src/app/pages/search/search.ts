
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CountriesService } from '../../services/countries';
import { Country } from '../../models/country';

@Component({
  selector: 'app-search',
  imports: [RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private service = inject(CountriesService);

  countries = toSignal(this.service.getAll(), {
    initialValue: [] as Country[]
  });

  query = signal('');

  private normalize(value: string): string {
    return value.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  results = computed(() => {
    const q = this.normalize(this.query());

    if (!q) return [];

    return this.countries().filter(c => {
      const fields = [
        c.names.common,
        c.names.official,
        c.codes.alpha_2,
        c.codes.alpha_3,
        c.region,
        ...(c.capitals ?? []).map(x => x.name),
        ...(c.languages ?? []).map(x => x.name),
        ...(c.currencies ?? []).flatMap(x => [x.name, x.code])
      ];

      return fields.some(value =>
        this.normalize(value ?? '').includes(q)
      );
    });
  });

  onSearch(event: Event): void {
    this.query.set(
      (event.target as HTMLInputElement).value
    );
  }
}
