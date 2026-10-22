import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss'
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);
  toasts$ = this.toastService.toasts$;

  getIcon(type: string): string {
    switch (type) {
      case 'ok': return 'check_circle';
      case 'warn': return 'warning';
      case 'danger': return 'error';
      default: return 'info';
    }
  }

  dismiss(id: string) {
    this.toastService.dismiss(id);
  }
}
