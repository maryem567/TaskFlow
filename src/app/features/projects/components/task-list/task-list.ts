
import { Component, input, output, signal, computed } from '@angular/core';

import { Task } from '../../models/task.model';
import { User } from '../../../users/models/user.model';
import { UserService } from '../../../../core/services/user.service';
import { TaskItem } from '../task-item/task-item';
import { TaskForm } from '../../../tasks/components/task-form/task-form';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItem, TaskForm],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList {

  tasks = input.required<Task[]>();
  showAssignee = input(true);

  users = signal<User[]>([]);

  // Gestion du formulaire
  showTaskForm = signal(false);
  selectedTask = signal<Task | null>(null);

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

  // Transmettre une tâche ajoutée ou modifiée
  taskSaved = output<{
    task: Task;
    isEdit: boolean;
  }>();

  constructor(private userService: UserService) {
    this.userService.getUsers().subscribe(users => {
      this.users.set(users);
    });
  }

  // Ouvrir le formulaire d'ajout
  onAddTask(): void {
    this.selectedTask.set(null);
    this.showTaskForm.set(true);
  }

  // Ouvrir le formulaire de modification
  onEditTask(task: Task): void {
    this.selectedTask.set(task);
    this.showTaskForm.set(true);
  }

  // Recevoir les données du formulaire
  onTaskSubmit(task: Task): void {
    const isEdit = this.selectedTask() !== null;

    this.taskSaved.emit({
      task,
      isEdit
    });

    this.showTaskForm.set(false);
    this.selectedTask.set(null);
  }

  // Fermer le formulaire
  onCancelForm(): void {
    this.showTaskForm.set(false);
    this.selectedTask.set(null);
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
