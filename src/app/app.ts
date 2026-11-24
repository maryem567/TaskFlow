
import { Component, signal, inject } from '@angular/core';

import { UserList } from './features/users/components/user-list/user-list';
import { ProjectList } from './features/projects/components/project-list/project-list';
import { ViewToggle } from './shared/components/view-toggle/view-toggle';

import { FavoritesService } from './core/services/favorites.service';
import { ThemeService } from './core/services/theme.service';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  imports: [ViewToggle, ProjectList, UserList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  // Service partagé des favoris
  favoritesService = inject(FavoritesService);

  // Service de gestion du thème
  themeService = inject(ThemeService);

  // Service de notifications
  notificationService = inject(NotificationService);

  currentView = signal<'task' | 'user'>('task');

  onViewChanged(view: 'task' | 'user'): void {
    this.currentView.set(view);
  }

}
