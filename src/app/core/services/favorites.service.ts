
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  // Liste des identifiants des projets favoris
  private favoriteIds = signal<number[]>([]);

  // Nombre total de projets favoris
  count = computed(() => this.favoriteIds().length);

  // Ajouter ou retirer un projet des favoris
  toggle(projectId: number): void {
    this.favoriteIds.update(ids => {
      if (ids.includes(projectId)) {
        return ids.filter(id => id !== projectId);
      }

      return [...ids, projectId];
    });
  }

  // Vérifier si un projet est dans les favoris
  isFavorite(projectId: number): boolean {
    return this.favoriteIds().includes(projectId);
  }
}
