
import { Component, input } from '@angular/core';
import { Task } from '../../../features/projects/models/task.model';

@Component({
  selector: 'app-task-status-badge',
  standalone: true,
  templateUrl: './task-status-badge.html',
  styleUrl: './task-status-badge.css'
})
export class TaskStatusBadge {
  status = input.required<Task['status']>();
}
