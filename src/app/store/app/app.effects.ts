import { inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  catchError,
  concat,
  distinctUntilChanged,
  exhaustMap,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { OrderService } from '@services/orders/order-service';
import { UserService } from '@services/users/user.service';

import { OrdersApiActions, UsersApiActions } from './app.actions';
import { appFeature } from './app.feature';

export const usersApiEffect = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) => {
    return actions$.pipe(
      ofType(UsersApiActions.loadUsers),
      exhaustMap(() =>
        concat(
          of(UsersApiActions.requestStart()),
          userService.getUsers().pipe(
            mergeMap((users) => [
              UsersApiActions.loadUsersSuccess({ users }),
              UsersApiActions.requestEnd(),
            ]),
            catchError((error: { message: string }) => [
              UsersApiActions.requestFailure({ errorMsg: error.message }),
              UsersApiActions.requestEnd(),
            ]),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const addNewUserApiEffect = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) => {
    return actions$.pipe(
      ofType(UsersApiActions.addUser),
      exhaustMap((v) =>
        concat(
          of(UsersApiActions.requestStart()),
          userService.addNewUser(v.user).pipe(
            mergeMap((user) => [
              UsersApiActions.addUserSuccess({ user }),
              UsersApiActions.requestEnd(),
            ]),
            catchError((error: { message: string }) => [
              UsersApiActions.requestFailure({ errorMsg: error.message }),
              UsersApiActions.requestEnd(),
            ]),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateUserApiEffect = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) => {
    return actions$.pipe(
      ofType(UsersApiActions.updateUser),
      exhaustMap(({ user }) =>
        concat(
          of(UsersApiActions.requestStart()),
          userService.updateUser(user).pipe(
            switchMap((updatedUser) => [
              UsersApiActions.updateUserSuccess({
                update: {
                  id: updatedUser.id,
                  changes: { name: updatedUser.name },
                },
              }),
              UsersApiActions.requestEnd(),
            ]),
            catchError((error: { message: string }) => [
              UsersApiActions.requestFailure({ errorMsg: error.message }),
              UsersApiActions.requestEnd(),
            ]),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const deleteUserApiEffect = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) => {
    return actions$.pipe(
      ofType(UsersApiActions.deleteUser),
      exhaustMap(({ id }) =>
        concat(
          of(UsersApiActions.requestStart()),
          userService.deleteUser(id).pipe(
            mergeMap((id) => [
              UsersApiActions.deleteUserSuccess({ id }),
              UsersApiActions.requestEnd(),
            ]),
            catchError((error: { message: string }) => [
              UsersApiActions.requestFailure({ errorMsg: error.message }),
              UsersApiActions.requestEnd(),
            ]),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const loadUserDetailsEffect = createEffect(
  (store = inject(Store), userService = inject(UserService)) => {
    return store.select(appFeature.selectSelectedUserId).pipe(
      distinctUntilChanged(),
      switchMap((id) => {
        if (id === null) {
          return of(UsersApiActions.setUserDetails({ userDetails: null }));
        }

        return concat(
          of(UsersApiActions.startLoadUserDetails()),
          userService.getUserDetails(id).pipe(
            map((userDetails) => UsersApiActions.setUserDetails({ userDetails })),
            catchError((err) =>
              of(
                UsersApiActions.setUserDetails({ userDetails: null }),
                UsersApiActions.requestFailure({ errorMsg: err.message }),
              ),
            ),
            tap(() => store.dispatch(UsersApiActions.endLoadUserDetails())),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const loadOrdersEffect = createEffect(
  (actions$ = inject(Actions), orderService = inject(OrderService)) => {
    return actions$.pipe(
      ofType(OrdersApiActions.loadOrders),
      exhaustMap(() =>
        concat(
          of(OrdersApiActions.loadOrdersStart()),
          orderService.getOrders().pipe(
            mergeMap((orders) => [
              OrdersApiActions.loadOrdersSuccess({ orders }),
              OrdersApiActions.loadOrdersEnd(),
            ]),
            catchError((err) => [
              OrdersApiActions.loadOrdersFailure({ errorMsg: err.message }),
              OrdersApiActions.loadOrdersEnd(),
            ]),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const displayErrorAlert = createEffect(
  () => {
    return inject(Actions).pipe(
      ofType(UsersApiActions.requestFailure),
      tap(({ errorMsg }) => alert(errorMsg)),
    );
  },
  { functional: true, dispatch: false },
);
