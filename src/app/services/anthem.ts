import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

export interface Anthem {
  title: string;
  audioUrl: string;
  pageUrl: string;
}

const AUDIO = /\.(ogg|oga|mp3|wav|opus)$/i;
const ANTHEM = /anthem|hymn|himno|hino/i;
const PRONUNCIATION = /^File:(en|fr|de|es|pt|it|nl|ru|ar)-/i;

@Injectable({ providedIn: 'root' })
export class AnthemService {
  private http = inject(HttpClient);

  private api(host: string, params: Record<string, string>): Observable<any> {
    return this.http.get<any>(`https://${host}/w/api.php`, {
      params: { action: 'query', format: 'json', formatversion: '2', origin: '*', ...params },
    });
  }

  private fileInfo(title: string): Observable<Anthem | null> {
    return this.api('en.wikipedia.org', { titles: title, prop: 'imageinfo', iiprop: 'url' }).pipe(
      map((res: any): Anthem | null => {
        const info = res?.query?.pages?.[0]?.imageinfo?.[0];
        return info
          ? { title: title.replace(/^File:/, ''), audioUrl: info.url, pageUrl: info.descriptionurl }
          : null;
      }),
    );
  }

  private fromCountryPage(country: string): Observable<Anthem | null> {
    return this.api('en.wikipedia.org', {
      titles: country,
      prop: 'images',
      imlimit: 'max',
      redirects: '1',
    }).pipe(
      map((res: any): string | null => {
        const files: string[] = (res?.query?.pages?.[0]?.images ?? []).map((i: any) => i.title);
        return files.find((f) => AUDIO.test(f) && ANTHEM.test(f) && !PRONUNCIATION.test(f)) ?? null;
      }),
      switchMap((file: string | null): Observable<Anthem | null> =>
        file ? this.fileInfo(file) : of(null),
      ),
    );
  }

  private fromSearch(country: string): Observable<Anthem | null> {
    const esc = country.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const name = new RegExp(`(^|[^a-z])${esc}([^a-z]|$)`);
    const other = /bissau|equatorial|papua/;

    return this.api('commons.wikimedia.org', {
      generator: 'search',
      gsrnamespace: '6',
      gsrlimit: '10',
      gsrsearch: `${country} national anthem filetype:audio`,
      prop: 'imageinfo',
      iiprop: 'url|mime',
    }).pipe(
      map((res: any): Anthem | null => {
        const pages = ((res?.query?.pages ?? []) as any[]).sort((a, b) => a.index - b.index);
        const hit = pages.find((p) => {
          const t = String(p.title).toLowerCase();
          const mime = p.imageinfo?.[0]?.mime ?? '';
          const isAudio = mime.startsWith('audio') || mime === 'application/ogg';
          return isAudio && name.test(t) && !other.test(t);
        });
        if (!hit) return null;
        const info = hit.imageinfo[0];
        return {
          title: String(hit.title).replace(/^File:/, ''),
          audioUrl: info.url,
          pageUrl: info.descriptionurl,
        };
      }),
    );
  }

  getAnthem(country: string): Observable<Anthem | null> {
    return this.fromCountryPage(country).pipe(
      switchMap((a: Anthem | null): Observable<Anthem | null> =>
        a ? of(a) : this.fromSearch(country),
      ),
      catchError(() => of(null)),
    );
  }
}
