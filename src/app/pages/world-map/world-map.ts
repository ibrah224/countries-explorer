import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import { CountriesService } from '../../services/countries';
import { Country } from '../../models/country';

@Component({
  selector: 'app-world-map',
  imports: [RouterLink],
  templateUrl: './world-map.html',
  styleUrl: './world-map.scss',
})
export class WorldMap implements AfterViewInit, OnDestroy {
  private service = inject(CountriesService);
  private router = inject(Router);

  private host = viewChild.required<ElementRef<HTMLDivElement>>('map');

  countries = toSignal(this.service.getAll(), {
    initialValue: [] as Country[],
  });

  private map?: L.Map;
  private markers = L.layerGroup();

  constructor() {
    effect(() => {
      const countries = this.countries();
      if (this.map) this.showCountries(countries);
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.host().nativeElement, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 7,
      worldCopyJump: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);

    this.markers.addTo(this.map);
    this.showCountries(this.countries());

    setTimeout(() => this.map?.invalidateSize(), 100);
  }

  private showCountries(countries: Country[]): void {
    this.markers.clearLayers();

    for (const country of countries) {
      const { lat, lng } = country.coordinates;

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) continue;

      L.circleMarker([lat, lng], {
        radius: 4,
        color: '#ffffff',
        weight: 1,
        fillColor: '#247bd1',
        fillOpacity: 0.9,
      })
        .bindTooltip(`${country.flag.emoji} ${country.names.common}`)
        .on('click', () => this.router.navigate(['/country', country.codes.alpha_3]))
        .addTo(this.markers);
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
