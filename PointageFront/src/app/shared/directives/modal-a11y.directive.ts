import { Directive, ElementRef, inject, OnInit, OnDestroy, HostListener, output } from '@angular/core';

/**
 * Directive d'accessibilité pour modales (WCAG 2.2 AA)
 * - Place le focus automatique sur le premier élément focusable ou la modale à l'ouverture
 * - Rétablit le focus sur l'élément déclencheur à la fermeture
 * - Intercepte et gère la touche Échap
 * - Piège de focus (Tab / Shift+Tab)
 */
@InjectableModalA11y()
@Directive({
  selector: '[appModalA11y]',
  standalone: true
})
export class ModalA11yDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private previousActiveElement: HTMLElement | null = null;

  readonly escapePressed = output<void>();

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      this.previousActiveElement = document.activeElement as HTMLElement;

      setTimeout(() => {
        const focusable = this.getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          this.el.nativeElement.focus();
        }
      }, 50);
    }
  }

  ngOnDestroy(): void {
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus();
    }
  }

  @HostListener('keydown.escape', ['$event'])
  onEscape(event: Event): void {
    event.stopPropagation();
    this.escapePressed.emit();
  }

  @HostListener('keydown.tab', ['$event'])
  onTab(event: KeyboardEvent): void {
    const focusable = this.getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const selector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(this.el.nativeElement.querySelectorAll(selector)) as HTMLElement[];
  }
}

function InjectableModalA11y() {
  return function (target: any) {};
}
