import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {
  transform(isoDate: string | undefined | null, prefix = ''): string {
    if (!isoDate) return '-';

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return '-';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffDays = Math.round((targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    let dayStr = '';
    if (diffDays === 0) {
      dayStr = 'Auj.';
    } else if (diffDays === 1) {
      dayStr = 'Demain';
    } else if (diffDays === -1) {
      dayStr = 'Hier';
    } else {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      dayStr = `${day}/${month}`;
    }

    const formatted = `${dayStr} ${timeStr}`;
    return prefix ? `${prefix} ${formatted}` : formatted;
  }
}
