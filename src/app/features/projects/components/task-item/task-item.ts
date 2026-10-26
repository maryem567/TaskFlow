
import { Component, input, output } from '@angular/core';
import { DatePipe, NgClass, NgStyle } from '@angular/common';

import { User } from '../../../users/models/user.model';
import { Task } from '../../models/task.model';
import { TruncatePipe } from '../../../../shared/pipes/truncate-pipe';
import { DeadlinePipe } from '../../../../shared/pipes/deadline-pipe';
import { Highlight } from '../../../../shared/directives/highlight';
import { Overdue } from '../../../../shared/directives/overdue';
import { Tooltip } from '../../../../shared/directives/tooltip';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    NgStyle,
    TruncatePipe,
    DeadlinePipe,
    Highlight,
    Overdue,
    Tooltip
  ],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css'
})
export class TaskItem {
  task = input.required<Task>();
  showAssignee = input(true);
  users = input<User[]>([]);

  taskStatusChange = output<Task['status']>();

  changeStatus(): void {
    const currentStatus = this.task().status;

    let newStatus: Task['status'];

    if (currentStatus === 'En attente') {
      newStatus = 'En cours';
    } else if (currentStatus === 'En cours') {
      newStatus = 'Terminé';
    } else {
      newStatus = 'En attente';
    }

    this.taskStatusChange.emit(newStatus);
  }

  getAssigneeName(task: Task): string {
    const user = this.users().find(
      user => user.id === task.assigneeId
    );

    return user?.name ?? 'Non assignée';
  }
  
  isOverdue(): boolean {
    const dueDate = this.task().dueDate;

    if (!dueDate || this.task().status === 'Terminé') {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(dueDate);
    deadline.setHours(0, 0, 0, 0);

    return deadline < today;
  }

}
