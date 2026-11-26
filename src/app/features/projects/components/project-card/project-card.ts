
import { Component, input, output, computed, inject, signal } from '@angular/core';
import { FavoritesService } from '../../../../core/services/favorites.service';
import {
  UpperCasePipe,
  DatePipe,
  CurrencyPipe,
  PercentPipe,
  DecimalPipe,
  KeyValuePipe,
  SlicePipe,
  NgStyle
} from '@angular/common';

import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { TaskList } from '../task-list/task-list';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    TaskList,
    UpperCasePipe,
    DatePipe,
    CurrencyPipe,
    PercentPipe,
    DecimalPipe,
    KeyValuePipe,
    NgStyle
  ],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css'
})
export class ProjectCard {

  project = input.required<Project>();

  // Afficher ou cacher la fenêtre de confirmation
  showDeleteConfirmation = signal(false);

  completedTaskCount = computed(() =>
    this.project().tasks.filter(
      task => task.status === 'Terminé'
    ).length
  );

  projectSelected = output<Project>();
  projectDelete = output<number>();

  // Ouvrir la fenêtre de confirmation
  onDeleteProject(): void {
    this.showDeleteConfirmation.set(true);
  }

  // Annuler la suppression
  cancelDelete(): void {
    this.showDeleteConfirmation.set(false);
  }

  // Confirmer la suppression
  confirmDelete(): void {
    this.projectDelete.emit(this.project().id);
    this.showDeleteConfirmation.set(false);
  }

  taskStatusChange = output<{
    projectId: number;
    taskId: number;
    newStatus: Task['status'];
  }>();

  taskDelete = output<{
    projectId: number;
    taskId: number;
  }>();
  taskSaved = output<{
  projectId: number;
  task: Task;
  isEdit: boolean;
}>();

  onTaskDelete(taskId: number): void {
    this.taskDelete.emit({
      projectId: this.project().id,
      taskId: taskId
    });
  }

  selectProject(): void {
    this.projectSelected.emit(this.project());
  }

  onTaskStatusChange(event: {
    taskId: number;
    newStatus: Task['status'];
  }): void {
    this.taskStatusChange.emit({
      projectId: this.project().id,
      taskId: event.taskId,
      newStatus: event.newStatus
    });
  }

  completionRate = computed(() => {
    const totalTasks = this.project().tasks.length;

    if (totalTasks === 0) {
      return 0;
    }

    return this.completedTaskCount() / totalTasks;
  });

  averageCostPerTask(): number {
    if (this.project().tasks.length === 0) {
      return 0;
    }

    return this.project().budget / this.project().tasks.length;
  }

  taskCountByPriority(): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const task of this.project().tasks) {
      counts[task.priority] = (counts[task.priority] || 0) + 1;
    }

    return counts;
  }

  favoritesService = inject(FavoritesService);

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.project().id);
  }

  toggleFavorite(): void {
    this.favoritesService.toggle(this.project().id);
  }
  onTaskSaved(event: {
  task: Task;
  isEdit: boolean;
}): void {
  this.taskSaved.emit({
    projectId: this.project().id,
    task: event.task,
    isEdit: event.isEdit
  });
}

  priorityOrder = (
    a: { key: string; value: number },
    b: { key: string; value: number }
  ): number => {
    const order: Record<string, number> = {
      Haute: 1,
      Moyenne: 2,
      Basse: 3
    };

    return order[a.key] - order[b.key];
  };

  get barColor(): string {
    const rate = this.completionRate() * 100;

    if (rate < 34) {
      return '#ef4444';
    }

    if (rate <= 66) {
      return '#f59e0b';
    }

    return '#22c55e';
  }
}
