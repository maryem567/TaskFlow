import { Component, computed, signal } from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../../../core/services/project';
import { ProjectCard } from '../project-card/project-card';

@Component({
  selector: 'app-project-list',
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
}