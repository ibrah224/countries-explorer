import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-country-map',
  template: '<div #map class="map"></div>',
  styleUrl: './country-map.scss',
})
export class CountryMap implements AfterViewInit, OnDestroy {
  lat = input.required<number>();
  lng = input.required<number>();
  zoom = input(5);
  label = input('');
  pin = input<{ lat: number; lng: number } | null>(null);

  private host = viewChild.required<ElementRef<HTMLDivElement>>('map');
  private map?: L.Map;
  private marker?: L.CircleMarker;

  constructor() {
    effect(() => {
      const state = {
        lat: this.lat(),
        lng: this.lng(),
        zoom: this.zoom(),
        pin: this.pin(),
        label: this.label(),
      };
      if (this.map) this.show(state);
    });
  }

  ngAfterViewInit() {
    this.map = L.map(this.host().nativeElement, { scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);
    this.show({
      lat: this.lat(),
      lng: this.lng(),
      zoom: this.zoom(),
      pin: this.pin(),
      label: this.label(),
    });
    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  private show(s: {
    lat: number;
    lng: number;
    zoom: number;
    pin: { lat: number; lng: number } | null;
    label: string;
  }) {
    const map = this.map!;
    map.setView([s.lat, s.lng], s.zoom);
    this.marker?.remove();
    const p = s.pin ?? { lat: s.lat, lng: s.lng };
    this.marker = L.circleMarker([p.lat, p.lng], { radius: 9, color: '#3b5bdb', fillOpacity: 0.85 })
      .addTo(map)
      .bindPopup(s.label);
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
