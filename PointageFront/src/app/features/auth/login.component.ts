import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

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

  selectedRole: UserRole = 'ADMIN';
  username = 'admin@geofleet.sn';
  password = '••••••••••••';
  rememberMe = true;

  selectRole(role: UserRole) {
    this.selectedRole = role;
    if (role === 'ADMIN') {
      this.username = 'admin@geofleet.sn';
    } else if (role === 'AGENT') {
      this.username = 'agent.samba@geofleet.sn';
    } else {
      this.username = 'chauffeur.diallo@geofleet.sn';
    }
  }

  onSubmit() {
    const session = this.authService.login(this.selectedRole, this.username);
    this.toastService.success(`Bienvenue ${session.fullName} (${session.roleLabel})`);

    if (this.selectedRole === 'DRIVER') {
      this.router.navigate(['/driver']);
    } else if (this.selectedRole === 'AGENT') {
      this.router.navigate(['/control']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  onForgotPassword() {
    this.toastService.info('Veuillez contacter le support informatique pour réinitialiser vos identifiants.');
  }
}
