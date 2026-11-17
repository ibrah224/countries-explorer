import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { CountriesService } from '../../services/countries';
import { WorldBankService } from '../../services/worldbank';
import { Article, WikipediaService } from '../../services/wikipedia';
import { CountryMap } from '../../components/country-map/country-map';
import { AnthemService, Anthem } from '../../services/anthem';
import { Country } from '../../models/country';

type Tab = 'general' | 'rankings' | 'history' | 'religion' | 'anthem';

@Component({
  selector: 'app-country-detail',
  imports: [RouterLink, DecimalPipe, CountryMap],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.scss',
})
export class CountryDetail {
  private route = inject(ActivatedRoute);
  private service = inject(CountriesService);
  private wb = inject(WorldBankService);
  private wiki: WikipediaService = inject(WikipediaService);
  private all = toSignal(this.service.getAll(), { initialValue: [] as Country[] });

  nameOf(code: string) {
    return this.all().find((x) => x.codes.alpha_3 === code)?.names.common ?? code;
  }
  country = toSignal(
    this.route.paramMap.pipe(switchMap((p) => this.service.getByCode(p.get('code') ?? ''))),
  );

  rankings = toSignal(
    this.route.paramMap.pipe(
      switchMap((p) => this.wb.getRankings((p.get('code') ?? '').toUpperCase())),
    ),
  );
  history = toSignal<Article | null | undefined>(
    toObservable(this.country).pipe(
      switchMap((c) => (c ? this.wiki.history(c.names.common) : of(undefined))),
    ),
  );

  religion = toSignal<Article | null | undefined>(
    toObservable(this.country).pipe(
      switchMap((c) => (c ? this.wiki.religion(c.names.common) : of(undefined))),
    ),
  );

  private anthemService = inject(AnthemService);

  anthemAudio = toSignal<Anthem | null | undefined>(
    toObservable(this.country).pipe(
      switchMap((c) => (c ? this.anthemService.getAnthem(c.names.common) : of(undefined))),
    ),
  );

  anthemText = toSignal<Article | null | undefined>(
    toObservable(this.country).pipe(
      switchMap((c) => (c ? this.wiki.anthem(c.names.common) : of(undefined))),
    ),
  );

  tab = signal<Tab>('general');

  tabs: { id: Tab; label: string }[] = [
    { id: 'general', label: 'Général' },
    { id: 'rankings', label: 'Classements' },
    { id: 'history', label: 'Histoire' },
    { id: 'religion', label: 'Religion' },
    { id: 'anthem', label: 'Hymne' },
  ];

  zoomFor(area: number) {
    if (area > 5_000_000) return 3;
    if (area > 1_000_000) return 4;
    if (area > 200_000) return 5;
    if (area > 50_000) return 6;
    if (area > 10_000) return 7;
    return 8;
  }
}
