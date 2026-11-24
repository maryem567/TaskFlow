
import { Component, input, output, effect } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Project, ProjectStatus } from '../../models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css'
})
export class ProjectForm {

  // Projet à modifier
  projectToEdit = input<Project | null>(null);

  // Événement envoyé au composant parent
  projectSubmit = output<Project>();

  // Liste des statuts
  statuses: ProjectStatus[] = [
    'En attente',
    'En cours',
    'Terminé'
  ];

  // Projet courant
  project: Project = {
    id: 0,
    name: '',
    description: '',
    status: 'En attente',
    tasks: [],
    startDate: '',
    budget: 0
  };

  constructor() {
    effect(() => {
      const selectedProject = this.projectToEdit();

      if (selectedProject) {
        // Charger les informations du projet à modifier
        this.project = { ...selectedProject };
      } else {
        // Préparer un formulaire vide pour un nouvel ajout
        this.project = {
          id: 0,
          name: '',
          description: '',
          status: 'En attente',
          tasks: [],
          startDate: '',
          budget: 0
        };
      }
    });
  }

  // Ajouter ou modifier un projet
  onSubmit(form: NgForm): void {

    if (form.invalid) {
      return;
    }

    console.log('Projet enregistré :', this.project);

    // Envoyer le projet au composant parent
    this.projectSubmit.emit({ ...this.project });
  }

  // Réinitialiser le formulaire
  resetForm(form: NgForm): void {

    const selectedProject = this.projectToEdit();

    if (selectedProject) {
      // Mode modification : restaurer les anciennes informations
      this.project = { ...selectedProject };
    } else {
      // Mode ajout : vider les champs
      this.project = {
        id: 0,
        name: '',
        description: '',
        status: 'En attente',
        tasks: [],
        startDate: '',
        budget: 0
      };
    }

    form.resetForm({
      general: {
        name: this.project.name,
        description: this.project.description,
        status: this.project.status,
        startDate: this.project.startDate
      },
      financial: {
        budget: this.project.budget
      }
    });
  }

}
