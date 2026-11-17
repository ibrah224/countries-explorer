import { Component, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CountriesService } from '../../services/countries';
import { Country } from '../../models/country';

type Mode = 'flags' | 'capitals' | 'regions' | 'languages' | 'currencies';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Question {
  prompt: string;
  answer: string;
  options: string[];
  image?: string;
}

@Component({
  selector: 'app-quiz',
  imports: [RouterLink],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz implements OnDestroy {
  private service = inject(CountriesService);

  countries = toSignal(this.service.getAll(), {
    initialValue: [] as Country[],
  });

  modes = [
    { id: 'flags', label: 'Drapeaux', icon: '🚩' },
    { id: 'capitals', label: 'Capitales', icon: '🏙️' },
    { id: 'regions', label: 'Régions', icon: '🌍' },
    { id: 'languages', label: 'Langues', icon: '🗣️' },
    { id: 'currencies', label: 'Monnaies', icon: '💱' },
  ];

  mode = signal<Mode>('flags');
  difficulty = signal<Difficulty>('medium');

  difficulties = [
    { id: 'easy', label: 'Facile' },
    { id: 'medium', label: 'Moyen' },
    { id: 'hard', label: 'Difficile' },
  ];
  questions = signal<Question[]>([]);
  index = signal(0);
  score = signal(0);
  selected = signal<string | null>(null);
  seconds = signal(15);
  finished = signal(false);
  started = signal(false);

  private timer?: ReturnType<typeof setInterval>;

  current = () => this.questions()[this.index()];
  total = 10;

  private shuffle<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
  }

  private value(c: Country, mode: Mode): string | undefined {
    switch (mode) {
      case 'flags':
        return c.names.common;

      case 'capitals':
        return c.capitals?.[0]?.name;

      case 'regions':
        return c.region;

      case 'languages':
        return c.languages?.length ? this.shuffle(c.languages)[0].name : undefined;

      case 'currencies':
        return c.currencies?.length ? this.shuffle(c.currencies)[0].name : undefined;
    }
  }

  start(mode: Mode = this.mode()): void {
    this.stopTimer();
    this.mode.set(mode);
    this.index.set(0);
    this.score.set(0);
    this.selected.set(null);
    this.finished.set(false);

    const pool = this.countries().filter(
      (c) => !!this.value(c, mode) && (mode !== 'flags' || !!c.flag?.url_svg),
    );

    const selectedCountries = this.shuffle(pool).slice(0, this.total);

    const questions = selectedCountries
      .map((c) => {
        const answer = this.value(c, mode)!;

        const others = [
          ...new Set(
            pool
              .filter((x) => x.codes.alpha_3 !== c.codes.alpha_3)
              .map((x) => this.value(x, mode))
              .filter((v): v is string => !!v && v !== answer),
          ),
        ];

        const wrongOptions = this.shuffle(others).slice(0, 3);

        const options = this.shuffle([answer, ...wrongOptions]);

        return {
          prompt:
            mode === 'flags'
              ? 'À quel pays appartient ce drapeau ?'
              : mode === 'capitals'
                ? `Quelle est la capitale de ${c.names.common} ?`
                : mode === 'regions'
                  ? `Dans quelle région se trouve ${c.names.common} ?`
                  : mode === 'languages'
                    ? `Quelle langue est parlée en ${c.names.common} ?`
                    : `Quelle monnaie utilise ${c.names.common} ?`,
          answer,
          options,
          image: mode === 'flags' ? c.flag.url_svg : undefined,
        };
      })
      .filter((q) => q.options.length === 4);

    if (questions.length < this.total) return;

    this.questions.set(questions);
    this.started.set(true);
    this.startTimer();
  }

  choose(answer: string): void {
    if (this.selected() !== null || this.finished()) return;

    this.selected.set(answer);
    if (answer === this.current().answer) {
      this.score.update((s) => s + 1);
    }
    this.stopTimer();
  }

  next(): void {
    this.stopTimer();
    if (this.index() + 1 >= this.questions().length) {
      this.finished.set(true);
      return;
    }

    this.index.update((i) => i + 1);
    this.selected.set(null);
    this.startTimer();
  }

  private startTimer(): void {
    const duration = this.difficulty() === 'easy' ? 20 : this.difficulty() === 'medium' ? 15 : 10;

    this.seconds.set(duration);
    this.timer = setInterval(() => {
      if (this.seconds() <= 1) {
        this.seconds.set(0);
        this.next();
      } else {
        this.seconds.update((s) => s - 1);
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
  questionScale = signal(1);
  minScale = 0.7;
  maxScale = 1.3;

  reduceSize(): void {
    this.questionScale.update((v) => Math.max(this.minScale, +(v - 0.1).toFixed(1)));
  }

  increaseSize(): void {
    this.questionScale.update((v) => Math.min(this.maxScale, +(v + 0.1).toFixed(1)));
  }
}
