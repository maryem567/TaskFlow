
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, finalize } from 'rxjs';
import { Project } from '../../features/projects/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  id = Math.random();

  // Liste partagée des projets
  projects = signal<Project[]>([]);

  // Signals pour le chargement et les erreurs
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {
    console.log('ProjectService créé, ID =', this.id);
  }

  getProjects(): Observable<Project[]> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<Project[]>('http://localhost:3000/projects').pipe(
      tap(projects => this.projects.set(projects)),
      catchError(err => {
        this.error.set('Erreur lors du chargement des projets.');
        console.error('Erreur HTTP :', err);
        return of([]);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  // Supprimer un projet
  deleteProject(projectId: number): void {
  this.http.delete(`http://localhost:3000/projects/${projectId}`).subscribe({
    next: () => {
      this.projects.update(projects =>
        projects.filter(project => Number(project.id) !== projectId)
      );
    },
    error: (err) => {
      this.error.set('Erreur lors de la suppression du projet.');
      console.error('Erreur lors de la suppression :', err);
    }
  });
}
}
