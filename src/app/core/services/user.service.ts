
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, finalize, map } from 'rxjs';
import { User } from '../../features/users/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  id = Math.random();

  // Signals pour le chargement et les erreurs
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Liste partagée des utilisateurs
  users = signal<User[]>([]);

  constructor(private http: HttpClient) {
    console.log('UserService créé, ID =', this.id);
  }

  // Récupérer tous les utilisateurs
  getUsers(): Observable<User[]> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<User[]>('http://localhost:3000/users').pipe(
      tap(users => this.users.set(users)),
      catchError(err => {
        this.error.set('Erreur lors du chargement des utilisateurs.');
        console.error('Erreur HTTP :', err);
        return of([]);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  // Récupérer un utilisateur par son ID
  getUserById(id: number): Observable<User | undefined> {
    return this.http.get<User[]>(`http://localhost:3000/users`).pipe(
      map(users => users.find(user => Number(user.id) === id)),
      catchError(err => {
        console.error('Erreur lors du chargement de l’utilisateur :', err);
        return of(undefined);
      })
    );
  }
}
