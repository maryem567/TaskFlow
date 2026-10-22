import { Component, signal } from '@angular/core';
import { UserList } from './features/users/components/user-list/user-list';
import { ProjectList } from './features/projects/components/project-list/project-list';
import { ViewToggle } from './shared/components/view-toggle/view-toggle';

@Component({
  selector: 'app-root',
  imports: [ViewToggle, ProjectList, UserList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  currentView = signal<'task' | 'user'>('task');

  onViewChanged(view: 'task' | 'user'): void {
    this.currentView.set(view);
  }

}