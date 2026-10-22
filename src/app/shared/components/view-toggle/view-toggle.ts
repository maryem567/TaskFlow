import { Component, output } from '@angular/core';

@Component({
  selector: 'app-view-toggle',
  imports: [],
  templateUrl: './view-toggle.html',
  styleUrl: './view-toggle.css'
})
export class ViewToggle {

  viewChanged = output<'task' | 'user'>();

  currentView: 'task' | 'user' = 'task';

  selectView(view: 'task' | 'user'): void {
    this.currentView = view;
    this.viewChanged.emit(view);
  }
}