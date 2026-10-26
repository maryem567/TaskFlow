
import { Component, computed, signal } from '@angular/core';

import { User } from '../../models/user.model';
import { UserService } from '../../../../core/services/user.service';
import { Project } from '../../../projects/models/project.model';
import { Task } from '../../../projects/models/task.model';
import { ProjectService } from '../../../../core/services/project';
import { UserCard } from '../user-card/user-card';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCard, EmptyState],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList {
  users = signal<User[]>([]);
  projects = signal<Project[]>([]);
  searchTerm = signal('');

  filteredUsers = computed(() => {
    const text = this.searchTerm().toLowerCase();

    return this.users().filter(user =>
      user.name.toLowerCase().includes(text)
    );
  });

  constructor(
    private userService: UserService,
    private projectService: ProjectService
  ) {
    this.userService.getUsers().subscribe(users => {
      this.users.set(users);
    });

    this.projectService.getProjects().subscribe(projects => {
      this.projects.set(projects);
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onTaskStatusChange(event: {
    projectId: Project['id'];
    taskId: Task['id'];
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