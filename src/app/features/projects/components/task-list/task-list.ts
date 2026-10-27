
import { Component, input, output, signal, computed } from '@angular/core';

import { Task } from '../../models/task.model';
import { User } from '../../../users/models/user.model';
import { UserService } from '../../../../core/services/user.service';
import { TaskItem } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItem],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList {
  tasks = input.required<Task[]>();
  showAssignee = input(true);

  users = signal<User[]>([]);

  // Filtre des tâches
  statusFilter = signal<'Toutes' | 'En cours' | 'Terminées'>('Toutes');

  filteredTasks = computed(() => {
    const filter = this.statusFilter();

    if (filter === 'Toutes') {
      return this.tasks();
    }

    if (filter === 'En cours') {
      return this.tasks().filter(task => task.status === 'En cours');
    }

    return this.tasks().filter(task => task.status === 'Terminé');
  });

  taskStatusChange = output<{
    taskId: Task['id'];
    newStatus: Task['status'];
  }>();

  taskDelete = output<number>();

  constructor(private userService: UserService) {
    this.userService.getUsers().subscribe(users => {
      this.users.set(users);
    });
  }

  onTaskStatusChange(
    taskId: Task['id'],
    newStatus: Task['status']
  ): void {
    this.taskStatusChange.emit({
      taskId,
      newStatus
    });
  }

  onDeleteTask(taskId: number): void {
    this.taskDelete.emit(taskId);
  }
}
