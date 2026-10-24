import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { ToastService } from '../../shared/services/toast.service';
import { NotificationService } from '../../core/services/notification.service';
import { ThemeService } from '../../core/services/theme.service';
import { map } from 'rxjs/operators';

import { ModalA11yDirective } from '../../shared/directives/modal-a11y.directive';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, FormsModule, ModalA11yDirective],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private mockService = inject(MockDataService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  notificationService = inject(NotificationService);
  themeService = inject(ThemeService);

  // Modal changement de mot de passe utilisateur
  isPasswordModalOpen = false;
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  user$ = this.authService.currentUser$;
  isSidebarCollapsed = false;
  isMobileDrawerOpen = false;
  isNotificationOpen = false;

  searchQuery = '';
  searchResults: any[] = [];

  newAlerts$ = this.mockService.getAlerts().pipe(
    map(alerts => alerts.filter(a => a.status === 'NOUVELLE'))
  );

  unreadAlertsCount$ = this.newAlerts$.pipe(
    map(alerts => alerts.length)
  );

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (typeof window !== 'undefined' && window.innerWidth > 1024) {
      if (this.isMobileDrawerOpen) {
        this.closeMobileDrawer();
      }
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMobileDrawer() {
    this.isMobileDrawerOpen = !this.isMobileDrawerOpen;
    this.updateBodyScrollLock();
  }

  closeMobileDrawer() {
    this.isMobileDrawerOpen = false;
    this.updateBodyScrollLock();
  }

  private updateBodyScrollLock() {
    if (typeof document !== 'undefined') {
      if (this.isMobileDrawerOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  toggleNotificationPopover() {
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  enablePushNotifications() {
    this.notificationService.requestPermission();
  }

  onSearchInput() {
    const q = (this.searchQuery || '').trim().toLowerCase();
    if (!q) {
      this.searchResults = [];
      return;
    }
    this.mockService.getVehicles().subscribe(vehicles => {
      this.searchResults = vehicles.filter(v =>
        v.registrationNumber.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        (v.assignedDriverName && v.assignedDriverName.toLowerCase().includes(q))
      );
    });
  }

  goToVehicleMap(vehicleId: string) {
    this.searchResults = [];
    this.searchQuery = '';
    this.router.navigate(['/map'], { queryParams: { vehicle: vehicleId } });
  }

  goToControl() {
    this.isNotificationOpen = false;
    this.router.navigate(['/control']);
  }

  onLogout() {
    this.authService.logout();
    this.toastService.info('Session clôturée avec succès.');
    this.router.navigate(['/login']);
  }

  openPasswordModal() {
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.isPasswordModalOpen = true;
  }

  closePasswordModal() {
    this.isPasswordModalOpen = false;
  }

  savePassword() {
    if (!this.passwordForm.currentPassword) {
      this.toastService.error('Veuillez saisir votre mot de passe actuel.');
      return;
    }

    if (!this.passwordForm.newPassword || this.passwordForm.newPassword.length < 6) {
      this.toastService.error('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.toastService.error('La confirmation ne correspond pas au nouveau mot de passe.');
      return;
    }

    // Succès
    this.toastService.success('Votre mot de passe a été modifié avec succès.');
    this.closePasswordModal();
  }
}
