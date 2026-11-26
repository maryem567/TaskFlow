
import { Component, computed, signal, inject } from '@angular/core';

import { RecentProjectsService } from '../../../../core/services/recent-projects.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { ProjectService } from '../../../../core/services/project';
import { ProjectCard } from '../project-card/project-card';
import { ProjectForm } from '../project-form/project-form';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [ProjectCard, ProjectForm],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectList {

  private projectService = inject(ProjectService);
  private recentProjectsService = inject(RecentProjectsService);
  private notificationService = inject(NotificationService);

  projects = this.projectService.projects;
  recentProjects = this.recentProjectsService.recentProjects;
  isLoading = this.projectService.isLoading;
  error = this.projectService.error;

  searchTerm = signal('');
  showProjectForm = signal(false);

  // Projet actuellement sélectionné pour la modification
  selectedProject = signal<Project | null>(null);

  // Filtrer les projets
  filteredProjects = computed(() => {
    const searchText = this.searchTerm().toLowerCase();

    return this.projects().filter(project =>
      project.name.toLowerCase().includes(searchText)
    );
  });

  constructor() {
    console.log(
      'ID ProjectService dans ProjectList :',
      this.projectService.id
    );

    this.projectService.getProjects().subscribe({
      next: (projects) => {
        console.log('Projets reçus depuis le serveur :', projects);

        if (this.error()) {
          this.notificationService.showError(
            'Erreur lors du chargement des projets !'
          );
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des projets :', err);
        this.notificationService.showError(
          'Impossible de charger les projets !'
        );
      }
    });
  }

  // Rechercher un projet
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  // Afficher ou fermer le formulaire
  toggleProjectForm(): void {
    this.selectedProject.set(null);
    this.showProjectForm.update(value => !value);
  }

  // Ajouter ou modifier un projet
  onProjectSubmit(project: Project): void {

    const projectToUpdate = this.selectedProject();

    if (projectToUpdate) {

      // MODIFICATION
      this.projectService.updateProject(project).subscribe({
        next: (updatedProject) => {
          console.log('Projet modifié avec succès :', updatedProject);

          this.notificationService.showSuccess(
            'Projet modifié avec succès !'
          );

          this.selectedProject.set(null);
          this.showProjectForm.set(false);
        },
        error: (err) => {
          console.error('Erreur lors de la modification :', err);

          this.notificationService.showError(
            'Erreur lors de la modification du projet !'
          );
        }
      });

    } else {

      // AJOUT
      this.projectService.addProject(project).subscribe({
        next: (newProject) => {
          console.log('Projet ajouté avec succès :', newProject);

          this.notificationService.showSuccess(
            'Projet ajouté avec succès !'
          );

          this.showProjectForm.set(false);
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout :', err);

          this.notificationService.showError(
            'Erreur lors de l’ajout du projet !'
          );
        }
      });
    }
  }

  // Sélectionner un projet à modifier
  onProjectSelected(project: Project): void {

    // Ajouter le projet aux derniers projets consultés
    this.recentProjectsService.addRecent(project);

    // Ouvrir le formulaire de modification
    this.selectedProject.set(project);
    this.showProjectForm.set(true);
  }

  // Modifier le statut d'une tâche
  onTaskStatusChange(event: {
    projectId: number;
    taskId: number;
    newStatus: Task['status'];
  }): void {
    this.projects.update(projects =>
      projects.map(project => {
        if (project.id !== event.projectId) {
          return project;
        }

        return {
          ...project,
          tasks: project.tasks.map(task =>
            task.id === event.taskId
              ? { ...task, status: event.newStatus }
              : task
          )
        };
      })
    );
  }

  // Supprimer une tâche
  onTaskDelete(event: {
    projectId: number;
    taskId: number;
  }): void {
    this.projects.update(projects =>
      projects.map(project => {
        if (project.id !== event.projectId) {
          return project;
        }

        return {
          ...project,
          tasks: project.tasks.filter(
            task => task.id !== event.taskId
          )
        };
      })
    );

    this.notificationService.showSuccess(
      'Tâche supprimée avec succès !'
    );
  }
  onTaskSaved(event: {
  projectId: number;
  task: Task;
  isEdit: boolean;
}): void {
  const project = this.projects().find(
    p => String(p.id) === String(event.projectId)
  );

  if (!project) {
    this.notificationService.showError('Projet introuvable !');
    return;
  }

  const updatedTasks = event.isEdit
    ? project.tasks.map(task =>
        String(task.id) === String(event.task.id)
          ? event.task
          : task
      )
    : [...project.tasks, event.task];

  const updatedProject = {
    ...project,
    tasks: updatedTasks
  };

  this.projectService.updateProject(updatedProject).subscribe({
    next: () => {
      this.notificationService.showSuccess(
        event.isEdit
          ? 'Tâche modifiée avec succès !'
          : 'Tâche ajoutée avec succès !'
      );
    },
    error: (err) => {
      console.error('Erreur lors de l’enregistrement de la tâche :', err);
      this.notificationService.showError(
        'Erreur lors de l’enregistrement de la tâche !'
      );
    }
  });
}

  // Supprimer un projet
onProjectDelete(projectId: number): void {
  this.projectService.deleteProject(projectId).subscribe({
    next: () => {
      this.notificationService.showSuccess(
        'Projet supprimé avec succès !'
      );
    },
    error: (err) => {
      console.error('Erreur lors de la suppression :', err);

      this.notificationService.showError(
        'Erreur lors de la suppression du projet !'
      );
    }
  });
}

}
