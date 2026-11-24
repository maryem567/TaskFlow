
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // Récupérer le dernier thème enregistré
  isDarkMode = signal(
    localStorage.getItem('theme') === 'dark'
  );

  constructor() {
    // Appliquer le thème enregistré au démarrage
    this.applyTheme();
  }

  // Changer le thème
  toggleTheme(): void {

    this.isDarkMode.update(value => !value);

    // Enregistrer le choix dans localStorage
    localStorage.setItem(
      'theme',
      this.isDarkMode() ? 'dark' : 'light'
    );

    // Appliquer le nouveau thème
    this.applyTheme();
  }

  // Appliquer le thème à toute l'application
  private applyTheme(): void {
    document.documentElement.classList.toggle(
      'dark',
      this.isDarkMode()
    );
  }

}
