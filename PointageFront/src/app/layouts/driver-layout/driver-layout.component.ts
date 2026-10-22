import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-driver-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './driver-layout.component.html',
  styleUrl: './driver-layout.component.scss'
})
export class DriverLayoutComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  user$ = this.authService.currentUser$;

  onLogout() {
    this.authService.logout();
    this.toastService.info('Session chauffeur clôturée.');
    this.router.navigate(['/login']);
  }
}
