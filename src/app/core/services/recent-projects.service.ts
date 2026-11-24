
import { Injectable, signal } from '@angular/core';
import { Project } from '../../features/projects/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class RecentProjectsService {

  // Liste des projets récemment consultés
  recentProjects = signal<Project[]>([]);

  // Ajouter un projet à la liste des récents
  addRecent(project: Project): void {

    this.recentProjects.update(projects => {

      // Éviter les doublons
      const filteredProjects = projects.filter(
        p => String(p.id) !== String(project.id)
      );

      // Ajouter le projet en première position
      return [project, ...filteredProjects].slice(0, 5);

    });
  }

}
