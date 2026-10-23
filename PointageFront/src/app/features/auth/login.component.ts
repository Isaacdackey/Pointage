import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  themeService = inject(ThemeService);

  selectedRole: UserRole = 'SUPER_ADMIN';
  username = 'admin@geofleet.sn';
  password = '••••••••••••';
  rememberMe = true;

  selectRole(role: UserRole) {
    this.selectedRole = role;
    if (role === 'SUPER_ADMIN') {
      this.username = 'admin@geofleet.sn';
    } else {
      this.username = 'logistique@geofleet.sn';
    }
  }

  onSubmit() {
    const session = this.authService.login(this.selectedRole, this.username);
    this.toastService.success(`Bienvenue ${session.fullName} (${session.roleLabel})`);
    this.router.navigate(['/dashboard']);
  }

  onForgotPassword() {
    this.toastService.info('Veuillez contacter le support informatique pour réinitialiser vos identifiants.');
  }
}
