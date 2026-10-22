
import { Component, input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Task } from '../../models/task.model';
import { users as USERS } from '../../../users/data/users.data';
import { TruncatePipe } from '../../../../shared/pipes/truncate-pipe';
import { DeadlinePipe } from '../../../../shared/pipes/deadline-pipe';
import { Highlight } from '../../../../shared/directives/highlight';
import { Overdue } from '../../../../shared/directives/overdue';
import { Tooltip } from '../../../../shared/directives/tooltip';
@Component({
  selector: 'app-task-list',
  imports: [
    DatePipe,
    NgClass,
    TruncatePipe,
    DeadlinePipe,
    Highlight,
    Overdue,
    Tooltip
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList {

  tasks = input.required<Task[]>();

  showAssignee = input(true);

  getAssigneeName(task: Task): string {
    const user = USERS.find(user => user.id === task.assigneeId);
    return user?.name ?? 'Non assignée';
  }
}
