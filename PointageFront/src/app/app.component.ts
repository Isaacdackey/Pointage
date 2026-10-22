import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  template: `
    <!-- Top-level Toast Notification host -->
    <app-toast-container></app-toast-container>

    <!-- Routed Layout Viewport -->
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
