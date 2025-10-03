import { Component } from '@angular/core';

import { OrderDetailsComponent } from './order-details-component/order-details-component';
import { UserDetailsComponent } from './user-details-component/user-details-component';

@Component({
  selector: 'app-user-orders-component',
  imports: [UserDetailsComponent, OrderDetailsComponent],
  templateUrl: './user-orders-component.html',
  styleUrl: './user-orders-component.scss',
})
export class UserOrdersComponent {}
