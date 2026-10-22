import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatusCategory = 'ok' | 'warn' | 'danger' | 'info' | 'neutral';

interface StatusConfig {
  label: string;
  category: StatusCategory;
  icon: string;
}

const STATUS_DICTIONARY: Record<string, StatusConfig> = {
  // Statuts Véhicule
  'DISPONIBLE': { label: 'Disponible', category: 'ok', icon: 'check_circle' },
  'EN_MISSION': { label: 'En mission', category: 'info', icon: 'local_shipping' },
  'INDISPONIBLE': { label: 'Indisponible', category: 'danger', icon: 'block' },
  'MAINTENANCE': { label: 'En maintenance', category: 'warn', icon: 'build' },
  'ARCHIVE': { label: 'Archivé', category: 'neutral', icon: 'archive' },

  // Statuts Traceur
  'ACTIF': { label: 'Actif', category: 'ok', icon: 'sensors' },
  'MUET': { label: 'Muet (> 1h)', category: 'danger', icon: 'wifi_off' },
  'NON_ASSOCIE': { label: 'Non associé', category: 'neutral', icon: 'link_off' },
  'DESACTIVE': { label: 'Désactivé', category: 'neutral', icon: 'power_settings_new' },

  // Statuts Mission
  'BROUILLON': { label: 'Brouillon', category: 'neutral', icon: 'edit_note' },
  'PLANIFIEE': { label: 'Planifiée', category: 'neutral', icon: 'schedule' },
  'DEMANDE_DEMARRAGE': { label: 'Départ en attente validation', category: 'warn', icon: 'hourglass_top' },
  'EN_COURS': { label: 'En cours', category: 'info', icon: 'navigation' },
  'EN_PAUSE': { label: 'En pause', category: 'warn', icon: 'pause_circle' },
  'ATTENTE_VALIDATION': { label: 'Arrivée en attente clôture', category: 'warn', icon: 'pending' },
  'TERMINEE': { label: 'Terminée', category: 'ok', icon: 'task_alt' },
  'EN_ANOMALIE': { label: 'En anomalie', category: 'danger', icon: 'error' },
  'ANNULEE': { label: 'Annulée', category: 'neutral', icon: 'cancel' },

  // Statuts Alertes
  'NOUVELLE': { label: 'Nouvelle', category: 'danger', icon: 'notification_important' },
  'PRISE_EN_CHARGE': { label: 'Prise en charge', category: 'warn', icon: 'pending_actions' },
  'CLOTUREE': { label: 'Clôturée', category: 'ok', icon: 'verified' },
  'IGNOREE': { label: 'Ignorée', category: 'neutral', icon: 'do_not_disturb_on' },

  // Sévérité Alertes
  'CRITIQUE': { label: 'Critique', category: 'danger', icon: 'crisis_alert' },
  'MAJEURE': { label: 'Majeure', category: 'warn', icon: 'warning' },
  'MINEURE': { label: 'Mineure', category: 'info', icon: 'info' },
  'INFO': { label: 'Information', category: 'neutral', icon: 'info' },

  // Types Alertes
  'SORTIE_ZONE': { label: 'Sortie de zone', category: 'danger', icon: 'wrong_location' },
  'PERTE_SIGNAL': { label: 'Perte de signal', category: 'danger', icon: 'signal_cellular_connected_no_internet_0_bar' },
  'EXCES_VITESSE': { label: 'Excès de vitesse', category: 'warn', icon: 'speed' },
  'RETARD': { label: 'Retard constaté', category: 'warn', icon: 'history_toggle_off' },
  'DEPART_NON_DECLARE': { label: 'Départ non déclaré', category: 'danger', icon: 'fmd_bad' },
  'INCIDENT_CHAUFFEUR': { label: 'Incident chauffeur', category: 'danger', icon: 'report_problem' },

  // Statuts Chauffeur / Utilisateur
  'CONGE': { label: 'En congé', category: 'warn', icon: 'beach_access' },
  'SUSPENDU': { label: 'Suspendu', category: 'danger', icon: 'person_off' },

  // Statuts Pointage Chauffeur
  'DEPART': { label: 'Départ validé', category: 'ok', icon: 'play_circle' },
  'PAUSE': { label: 'Pause trajet', category: 'warn', icon: 'pause_circle' },
  'REPRISE': { label: 'Reprise trajet', category: 'info', icon: 'play_arrow' },
  'ARRIVEE': { label: 'Arrivée clôturée', category: 'ok', icon: 'flag' },
  'INCIDENT': { label: 'Incident signalé', category: 'danger', icon: 'report_problem' }
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss'
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: string;
  @Input() customLabel?: string;

  get config(): StatusConfig {
    const key = (this.status || '').toUpperCase().trim();
    const resolved = STATUS_DICTIONARY[key] || {
      label: this.status || 'Inconnu',
      category: 'neutral',
      icon: 'help_outline'
    };
    if (this.customLabel) {
      return { ...resolved, label: this.customLabel };
    }
    return resolved;
  }
}
