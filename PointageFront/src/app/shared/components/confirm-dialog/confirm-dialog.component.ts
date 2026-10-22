import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  @Input() type: 'ok' | 'warn' | 'danger' | 'info' = 'warn';
  @Input() confirmText = 'Confirmer';
  @Input() cancelText = 'Annuler';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  id = Math.random().toString(36).substring(2, 9);

  get iconName(): string {
    switch (this.type) {
      case 'danger': return 'warning';
      case 'warn': return 'help';
      case 'ok': return 'check_circle';
      default: return 'info';
    }
  }

  get confirmBtnClass(): string {
    if (this.type === 'danger') return 'btn-danger';
    return 'btn-primary';
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('dialog-backdrop')) {
      this.cancel.emit();
    }
  }
}
