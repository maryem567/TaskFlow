
import { Component, computed, signal, inject } from '@angular/core';

import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { ProjectService } from '../../../../core/services/project';
import { ProjectCard } from '../project-card/project-card';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [ProjectCard],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectList {
  
  private projectService = inject(ProjectService);
  projects = this.projectService.projects;
  isLoading = this.projectService.isLoading;
  error = this.projectService.error;
  searchTerm = signal('');

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
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onProjectSelected(project: Project): void {
    console.log(project);
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
