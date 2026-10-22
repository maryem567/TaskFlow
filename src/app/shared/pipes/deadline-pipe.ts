
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Deadline',
  standalone: true
})
export class DeadlinePipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) {
      return 'Pas d’échéance';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(value + 'T00:00:00');

    const difference = Math.round(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (difference === 0) {
      return 'Aujourd’hui';
    }

    if (difference === 1) {
      return 'Demain';
    }

    if (difference > 1) {
      return `Dans ${difference} jours`;
    }

    const lateDays = Math.abs(difference);

    if (lateDays === 1) {
      return 'En retard de 1 jour';
    }

    return `En retard de ${lateDays} jours`;
  }
}
