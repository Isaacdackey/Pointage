import { Injectable, signal, computed, effect } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'geofleet-theme';
  private hasExplicitUserChoice = false;

  // Signal principal du thème
  readonly theme = signal<AppTheme>(this.getInitialTheme());

  // Signal calculé booléen
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    // Appliquer les effets DOM (classe body, colorScheme, meta theme-color)
    effect(() => {
      const current = this.theme();
      const isDarkMode = current === 'dark';
      this.applyThemeToDom(isDarkMode);
    });

    // Écouter les changements système prefers-color-scheme si l'utilisateur n'a pas fait de choix explicite
    this.listenToSystemPreference();
  }

  toggle(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.set(next);
  }

  set(newTheme: AppTheme): void {
    this.hasExplicitUserChoice = true;
    this.theme.set(newTheme);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.storageKey, newTheme);
      } catch (e) {
        // Ignorer les erreurs d'accès au stockage local en navigation privée
      }
    }
  }

  private getInitialTheme(): AppTheme {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved === 'light' || saved === 'dark') {
          this.hasExplicitUserChoice = true;
          return saved;
        }
      } catch (e) {
        // Fallback
      }

      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  }

  private listenToSystemPreference(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!this.hasExplicitUserChoice) {
        this.theme.set(e.matches ? 'dark' : 'light');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handler);
    }
  }

  private applyThemeToDom(isDarkMode: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }

    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }

    if (document.documentElement) {
      document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
    }

    // Mise à jour de la balise <meta name="theme-color">
    const themeColor = isDarkMode ? '#0b0f19' : '#ea4c0e';
    const metaTags = document.querySelectorAll('meta[name="theme-color"]');
    if (metaTags.length > 0) {
      metaTags.forEach(meta => meta.setAttribute('content', themeColor));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = themeColor;
      document.head.appendChild(meta);
    }
  }
}
