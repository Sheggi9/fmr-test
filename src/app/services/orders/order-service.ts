import { Injectable } from '@angular/core';

import { Observable, delay, of } from 'rxjs';

import { Order } from '@models/order.models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private mockOrders: Order[] = [
    { id: 0, userId: 0, total: 80 },
    { id: 1, userId: 0, total: 160 },
    { id: 2, userId: 0, total: 20 },
    { id: 3, userId: 1, total: 100 },
    { id: 4, userId: 1, total: 50 },
    { id: 5, userId: 2, total: 75 },
  ];

  getOrders(): Observable<Order[]> {
    return of(this.mockOrders).pipe(delay(700));
  }

  addOrder(order: Order): Observable<Order> {
    this.mockOrders.push(order);
    return of(order);
  }

  updateOrder(updatedOrder: Order): Observable<Order> {
    const index = this.mockOrders.findIndex((o) => o.id === updatedOrder.id);
    if (index >= 0) {
      this.mockOrders[index] = updatedOrder;
    }
    return of(updatedOrder);
  }

  deleteOrder(orderId: number): Observable<number> {
    this.mockOrders = this.mockOrders.filter((o) => o.id !== orderId);
    return of(orderId);
  }

  deleteOrdersByUser(userId: number): Observable<number> {
    const deletedIds = this.mockOrders.filter((o) => o.userId === userId).map((o) => o.id);
    console.log('Deleted orders: ', deletedIds.join(','));
    this.mockOrders = this.mockOrders.filter((o) => o.userId !== userId);
    return of(userId).pipe(delay(800));
  }
}
