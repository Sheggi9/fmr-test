import { Update } from '@ngrx/entity';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Order } from '../../models/order.models';
import { NewUser, User } from '../../models/user.models';

export const UsersApiActions = createActionGroup({
  source: 'Users API',
  events: {
    'Request Start': emptyProps(),
    'Request End': emptyProps(),

    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),

    'Add User': props<{ user: NewUser }>(),
    'Add User Success': props<{ user: User }>(),

    'Update User': props<{ user: User }>(),
    'Update User Success': props<{ update: Update<User> }>(),

    'Delete User': props<{ id: number }>(),
    'Delete User Success': props<{ id: number }>(),

    'Set Selected User': props<{ id: number }>(),
    'Set User Details': props<{ userDetails: string | null }>(),

    'Start Load User Details': emptyProps(),
    'End Load User Details': emptyProps(),

    'Request Failure': props<{ errorMsg: string }>(),
  },
});

export const OrdersApiActions = createActionGroup({
  source: 'Orders API',
  events: {
    'Load Orders Start': emptyProps(),
    'Load Orders End': emptyProps(),

    'Load Orders': emptyProps(),
    'Load Orders Success': props<{ orders: Order[] }>(),
    'Load Orders Failure': props<{ errorMsg: string }>(),
    'Add Order': props<{ order: Order }>(),
    'Update Order': props<{ update: Update<Order> }>(),
    'Delete Order': props<{ id: number }>(),
  },
});
