import { User } from '../models/user.model';

export const users: User[] = [
  {
    id: 1,
    name: 'Amira Ben Salah',
    email: 'amira@taskflow.tn',
    role: 'Développeur',
    active: true
  },
  {
    id: 2,
    name: 'Ahmed Trabelsi',
    email: 'ahmed@taskflow.tn',
    role: 'Designer',
    active: true
  },
  {
    id: 3,
    name: 'Sarra Mansour',
    email: 'sarra@taskflow.tn',
    role: 'Chef de projet',
    active: true
  },
  {
    id: 4,
    name: 'Youssef Ben Ali',
    email: 'youssef@taskflow.tn',
    role: 'Testeur',
    active: false
  }
];