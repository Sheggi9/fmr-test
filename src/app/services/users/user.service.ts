import { Injectable, inject } from '@angular/core';

import { Observable, delay, of, switchMap, throwError } from 'rxjs';

import { NewUser, User } from '@models/user.models';

import { OrderService } from '../orders/order-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private orderService: OrderService = inject(OrderService);
  private mockUsers: User[] = [
    { id: 0, name: 'User 1' },
    { id: 1, name: 'User 2' },
    { id: 2, name: 'User 3' },
  ];

  getUsers(): Observable<User[]> {
    return of(this.mockUsers).pipe(delay(500));
  }
  addNewUser(user: NewUser): Observable<User> {
    const newId = this.mockUsers.length > 0 ? Math.max(...this.mockUsers.map((u) => u.id)) + 1 : 0;
    const newUser: User = {
      id: newId,
      name: user.name,
    };
    this.mockUsers = [...this.mockUsers, newUser];
    return of(newUser).pipe(delay(500));
  }

  deleteUser(id: number) {
    this.mockUsers = this.mockUsers.filter((u) => u.id !== id);
    return of(id).pipe(
      delay(600),
      switchMap(() => this.orderService.deleteOrdersByUser(id)),
    );
  }

  updateUser(user: User) {
    const index = this.mockUsers.findIndex((u) => u.id === user.id);
    if (index === -1) {
      return throwError(() => new Error(`User with id ${user.id} not found`));
    }
    const updated: User = { ...this.mockUsers[index], ...user, id: this.mockUsers[index].id };
    this.mockUsers = [
      ...this.mockUsers.slice(0, index),
      updated,
      ...this.mockUsers.slice(index + 1),
    ];
    return of(updated).pipe(delay(500));
  }

  getUserDetails(id: number) {
    return of(`Details for user with id ${id}`).pipe(delay(500));
  }
}
