
import { Component, computed, signal, inject } from '@angular/core';

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

  projects = this.projectService.projects;
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
      },
      error: (err) => {
        console.error('Erreur lors du chargement des projets :', err);
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

          this.selectedProject.set(null);
          this.showProjectForm.set(false);
        },
        error: (err) => {
          console.error('Erreur lors de la modification :', err);
        }
      });

    } else {

      // AJOUT
      this.projectService.addProject(project).subscribe({
        next: (newProject) => {
          console.log('Projet ajouté avec succès :', newProject);

          this.showProjectForm.set(false);
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout du projet :', err);
        }
      });
    }
  }

  // Sélectionner un projet à modifier
  onProjectSelected(project: Project): void {
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
  }

  // Supprimer un projet
  onProjectDelete(projectId: number): void {
    this.projectService.deleteProject(projectId);
  }
}
