import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  {
    path: 'countries',
    loadComponent: () => import('./pages/country-list/country-list').then((m) => m.CountryList),
  },
  {
    path: 'explore/:type',
    loadComponent: () => import('./pages/explore/explore').then((m) => m.Explore),
  },
  { path: 'facts', loadComponent: () => import('./pages/facts/facts').then((m) => m.Facts) },
  {
    path: 'country/:code',
    loadComponent: () =>
      import('./pages/country-detail/country-detail').then((m) => m.CountryDetail),
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search').then((m) => m.Search),
  },
  {
    path: 'world-map',
    loadComponent: () => import('./pages/world-map/world-map').then((m) => m.WorldMap),
  },
  {
    path: 'quiz',
    loadComponent: () => import('./pages/quiz/quiz').then((m) => m.Quiz),
  },
  { path: '**', redirectTo: '' },
];
