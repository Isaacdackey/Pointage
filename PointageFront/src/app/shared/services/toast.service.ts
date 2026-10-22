import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'ok' | 'warn' | 'danger' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  durationMs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  show(message: string, type: ToastType = 'info', title?: string, durationMs: number = 4000) {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, title, message, durationMs };
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, toast]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
    }
  }

  success(message: string, title: string = 'Succès') {
    this.show(message, 'ok', title);
  }

  error(message: string, title: string = 'Erreur') {
    this.show(message, 'danger', title, 6000);
  }

  warning(message: string, title: string = 'Attention') {
    this.show(message, 'warn', title, 5000);
  }

  info(message: string, title: string = 'Information') {
    this.show(message, 'info', title);
  }

  dismiss(id: string) {
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next(current.filter(t => t.id !== id));
  }
}
