
import { Component, computed, signal } from '@angular/core';
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

  projects = signal<Project[]>([]);
  searchTerm = signal('');

  filteredProjects = computed(() => {
    const searchText = this.searchTerm().toLowerCase();

    return this.projects().filter(project =>
      project.name.toLowerCase().includes(searchText)
    );
  });

  constructor(private projectService: ProjectService) {
    this.projectService.getProjects().subscribe(projects => {
      this.projects.set(projects);
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onProjectSelected(project: Project): void {
    console.log(project);
  }

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
}
