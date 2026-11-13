import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

export interface Article {
  title: string;
  text: string;
  url: string;
  lang: 'fr' | 'en';
}

@Injectable({ providedIn: 'root' })
export class WikipediaService {
  private http = inject(HttpClient);

  private api(lang: 'fr' | 'en', params: Record<string, string>): Observable<any> {
    return this.http.get<any>(`https://${lang}.wikipedia.org/w/api.php`, {
      params: { action: 'query', format: 'json', formatversion: '2', origin: '*', ...params },
    });
  }

  private query(extra: Record<string, string>): Observable<any> {
    return this.api('en', {
      prop: 'extracts|langlinks|info',
      exintro: '1',
      explaintext: '1',
      lllang: 'fr',
      inprop: 'url',
      redirects: '1',
      ...extra,
    }).pipe(
      map((res: any) => ((res?.query?.pages ?? []) as any[]).find(p => !p.missing && p.extract) ?? null)
    );
  }

  private withFrench(page: any): Observable<Article> {
    const en: Article = { title: page.title, text: page.extract, url: page.fullurl, lang: 'en' };
    const frTitle = page.langlinks?.[0]?.title;
    if (!frTitle) return of(en);

    return this.api('fr', {
      titles: frTitle,
      prop: 'extracts|info',
      exintro: '1',
      explaintext: '1',
      inprop: 'url',
      redirects: '1',
    }).pipe(
      map((res: any): Article => {
        const p = res?.query?.pages?.[0];
        return p?.extract
          ? { title: p.title, text: p.extract, url: p.fullurl, lang: 'fr' }
          : en;
      }),
      catchError(() => of(en))
    );
  }

  private find(title: string): Observable<Article | null> {
    return this.query({ titles: title }).pipe(
      switchMap((page: any) =>
        page ? of(page) : this.query({ generator: 'search', gsrsearch: title, gsrlimit: '1' })
      ),
      switchMap((page: any): Observable<Article | null> =>
        page ? this.withFrench(page) : of(null)
      ),
      catchError(() => of(null))
    );
  }

  history(country: string): Observable<Article | null> {
    return this.find(`History of ${country}`);
  }

  religion(country: string): Observable<Article | null> {
    return this.find(`Religion in ${country}`);
  }

    anthem(country: string): Observable<Article | null> {
    return this.find(`National anthem of ${country}`);
  }
}