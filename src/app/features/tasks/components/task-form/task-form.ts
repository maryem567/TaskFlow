
import {
  Component,
  input,
  output,
  inject,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from '../../../projects/models/task.model';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnInit, OnChanges {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  // Recevoir une tâche à modifier
  task = input<Task | null>(null);

  // Envoyer les données au composant parent
  taskSubmit = output<Task>();

  // Liste des utilisateurs
  users = this.userService.users;

  // Priorités disponibles
  priorities: TaskPriority[] = [
    'Haute',
    'Moyenne',
    'Basse'
  ];

  // Statuts disponibles
  statuses: TaskStatus[] = [
    'En attente',
    'En cours',
    'Terminé'
  ];

  // Construction du formulaire
  taskForm: FormGroup = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(3)
    ]],

    description: ['', [
      Validators.maxLength(200)
    ]],

    priority: ['Moyenne', Validators.required],

    status: ['En attente', Validators.required],

    dueDate: ['', Validators.required],

    assigneeId: [null]
  });

  ngOnInit(): void {
    // Récupérer les utilisateurs depuis UserService
    this.userService.getUsers().subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      const currentTask = this.task();

      if (currentTask) {
        // Préremplir le formulaire en mode modification
        this.taskForm.patchValue({
          title: currentTask.title,
          description: currentTask.description ?? '',
          priority: currentTask.priority,
          status: currentTask.status,
          dueDate: currentTask.dueDate ?? '',
          assigneeId: currentTask.assigneeId ?? null
        });
      } else {
        this.taskForm.reset({
          title: '',
          description: '',
          priority: 'Moyenne',
          status: 'En attente',
          dueDate: '',
          assigneeId: null
        });
      }
    }
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.getRawValue();

    const taskData: Task = {
      id: this.task()?.id ?? Date.now(),
      title: formValue.title,
      description: formValue.description || undefined,
      priority: formValue.priority,
      status: formValue.status,
      dueDate: formValue.dueDate || undefined,
      assigneeId: formValue.assigneeId ?? undefined
    };

    console.log('Données de la tâche :', taskData);

    // Transmettre la tâche au composant parent
    this.taskSubmit.emit(taskData);

    // Réinitialiser le formulaire après soumission
    this.taskForm.reset({
      title: '',
      description: '',
      priority: 'Moyenne',
      status: 'En attente',
      dueDate: '',
      assigneeId: null
    });
  }
}
