
import { Component, input, output } from '@angular/core';
import { Project } from '../../../projects/models/project.model';
import { Task } from '../../../projects/models/task.model';
import { TaskList } from '../../../projects/components/task-list/task-list';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-user-project-group',
  standalone: true,
  imports: [TaskList, SlicePipe],
  templateUrl: './user-project-group.html',
  styleUrl: './user-project-group.css'
})
export class UserProjectGroup {
  project = input.required<Project>();
  tasks = input.required<Task[]>();

  taskStatusChange = output<{
    projectId: Project['id'];
    taskId: Task['id'];
    newStatus: Task['status'];
  }>();
}
