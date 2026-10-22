import { Injectable, inject } from '@angular/core';
import { ToastService } from '../../shared/services/toast.service';

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  sound?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toast = inject(ToastService);
  private permissionGranted = false;

  constructor() {
    this.checkInitialPermission();
  }

  private checkInitialPermission() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permissionGranted = Notification.permission === 'granted';
    }
  }

  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      this.toast.info('Notifications du navigateur non prises en charge sur ce système.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      if (this.permissionGranted) {
        this.toast.success('Notifications Push activées avec succès !');
        this.sendPushNotification({
          title: 'GeoFleet Supervision',
          body: 'Vous recevrez désormais les alertes et demandes de départ en temps réel.'
        });
      } else {
        this.toast.warning('Autorisation refusée pour les notifications système.');
      }
      return this.permissionGranted;
    } catch {
      return false;
    }
  }

  isPermissionGranted(): boolean {
    return this.permissionGranted;
  }

  sendPushNotification(payload: PushNotificationPayload): void {
    
    this.toast.info(`${payload.title} — ${payload.body}`);

    
    this.playAudioChime();

    
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([150, 50, 150]);
    }

    
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(payload.title, {
          body: payload.body,
          icon: payload.icon || '/favicon.ico',
          badge: '/favicon.ico',
          tag: payload.tag || 'geofleet-alert'
        });
      } catch {

      }
    }
  }

  private playAudioChime() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      
    }
  }
}
