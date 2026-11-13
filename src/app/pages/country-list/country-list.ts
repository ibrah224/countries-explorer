import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CountriesService } from '../../services/countries';
import { Country } from '../../models/country';

@Component({
  selector: 'app-country-list',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './country-list.html',
  styleUrl: './country-list.scss',
})
export class CountryList {
  private service = inject(CountriesService);

  countries = toSignal(this.service.getAll(), { initialValue: [] as Country[] });
  search = signal('');
  region = signal('');

  regions = computed(() =>
    [...new Set(this.countries().map(c => c.region).filter(Boolean))].sort()
  );

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const r = this.region();
    return this.countries().filter(c =>
      (!r || c.region === r) &&
      (!q ||
        c.names.common.toLowerCase().includes(q) ||
        c.capitals?.some(cap => cap.name.toLowerCase().includes(q)))
    );
  });
}