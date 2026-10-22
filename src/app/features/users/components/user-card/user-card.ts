
import { Component, computed, input } from '@angular/core';
import {
  LowerCasePipe,
  TitleCasePipe,
  NgClass,
  NgStyle
} from '@angular/common';

import { User } from '../../models/user.model';
import { Project } from '../../../projects/models/project.model';
import { UserProjectGroup } from '../user-project-group/user-project-group';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { InitialsPipe } from '../../../../shared/pipes/initials-pipe';

@Component({
  selector: 'app-user-card',
  imports: [
    UserProjectGroup,
    EmptyState,
    InitialsPipe,
    LowerCasePipe,
    TitleCasePipe,
    NgClass,
    NgStyle
  ],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css'
})
export class UserCard {
  user = input.required<User>();
  projects = input.required<Project[]>();

  assignedTasks = computed(() =>
    this.projects()
      .flatMap(project => project.tasks)
      .filter(task => task.assigneeId === this.user().id)
  );

  todoCount = computed(() =>
    this.assignedTasks().filter(
      task => task.status === 'En attente'
    ).length
  );

  inProgressCount = computed(() =>
    this.assignedTasks().filter(
      task => task.status === 'En cours'
    ).length
  );

  doneCount = computed(() =>
    this.assignedTasks().filter(
      task => task.status === 'Terminé'
    ).length
  );

  projectGroups = computed(() =>
    this.projects()
      .map(project => ({
        project,
        tasks: project.tasks.filter(
          task => task.assigneeId === this.user().id
        )
      }))
      .filter(group => group.tasks.length > 0)
  );
  
get roleColor(): string {
  switch (this.user().role) {
    case 'Développeur':
      return '#10b981'; // Vert

    case 'Designer':
      return '#ec4899'; // Rose

    case 'Chef de projet':
      return '#8b5cf6'; // Violet

    case 'Testeur':
      return '#f59e0b'; // Orange
  }
}

  
}
