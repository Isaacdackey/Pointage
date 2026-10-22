import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { ToastService } from '../../shared/services/toast.service';
import { NotificationService } from '../../core/services/notification.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, FormsModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private mockService = inject(MockDataService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  notificationService = inject(NotificationService);

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

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMobileDrawer() {
    this.isMobileDrawerOpen = !this.isMobileDrawerOpen;
  }

  closeMobileDrawer() {
    this.isMobileDrawerOpen = false;
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
}
