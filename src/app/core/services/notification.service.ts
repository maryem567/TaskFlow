
import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // Message à afficher
  message = signal<string>('');

  // Type de notification
  type = signal<NotificationType>('success');

  // Afficher une notification de succès
  showSuccess(message: string): void {
    this.show(message, 'success');
  }

  // Afficher une notification d'erreur
  showError(message: string): void {
    this.show(message, 'error');
  }

  // Afficher une notification d'information
  showInfo(message: string): void {
    this.show(message, 'info');
  }

  // Afficher le message pendant 3 secondes
  private show(message: string, type: NotificationType): void {
    this.message.set(message);
    this.type.set(type);

    setTimeout(() => {
      this.clear();
    }, 3000);
  }

  // Effacer la notification
  clear(): void {
    this.message.set('');
  }
}
