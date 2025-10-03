import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { filter, take } from 'rxjs';

import { OrdersApiActions, UsersApiActions } from '@store/app/app.actions';
import { appFeature } from '@store/app/app.feature';

import { Order } from '@models/order.models';
import { User } from '@models/user.models';

import { UserOrdersComponent } from './components/user-orders-component/user-orders-component';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, UserOrdersComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly store = inject(Store);
  private formBuilder = inject(FormBuilder);
  private actions = inject(Actions);

  newUserForm = this.formBuilder.group({
    id: [''],
    name: ['', Validators.required],
  });

  userListForm = this.formBuilder.group({
    users: this.formBuilder.array([]),
  });

  usersFormArray = signal((this.userListForm.get('users') as FormArray).controls);

  users = toSignal(this.store.select(appFeature.selectAllUsers), { initialValue: [] as User[] });
  orders = toSignal(this.store.select(appFeature.selectAllOrders), { initialValue: [] as Order[] });
  loadingUsers = toSignal(this.store.select(appFeature.selectLoadingUsers), { initialValue: true });
  loadingOrders = toSignal(this.store.select(appFeature.selectLoadingOrders), {
    initialValue: true,
  });
  selectedUser = toSignal(this.store.select(appFeature.selectSelectedUser), { initialValue: null });
  ordersForSelectedUser = toSignal(this.store.select(appFeature.selectOrdersForSelectedUser), {
    initialValue: [],
  });
  userWithOrdersSummary = toSignal(this.store.select(appFeature.selectUserWithOrdersSummary), {
    initialValue: null,
  });

  constructor() {
    effect(() => {
      const users = this.users();
      const usersFormArray = this.userListForm.get('users') as FormArray;
      users.forEach((user) => {
        if (!user) return;
        const existingIndex = usersFormArray.controls.findIndex(
          (ctrl) => ctrl.get('id')?.value === user.id,
        );
        if (existingIndex !== -1) {
          const ctrl = usersFormArray.at(existingIndex);
          ctrl.get('name')?.setValue(user.name, { emitEvent: false });
        } else {
          usersFormArray.push(
            this.formBuilder.group({
              id: [{ value: user.id, disabled: true }],
              name: [{ value: user.name, disabled: true }, Validators.required],
            }),
          );
        }
      });
    });
  }

  ngOnInit() {
    this.store.dispatch(UsersApiActions.loadUsers());
    this.store.dispatch(OrdersApiActions.loadOrders());
  }

  addUser() {
    if (this.newUserForm.valid) {
      this.store.dispatch(
        UsersApiActions.addUser({
          user: {
            name: this.newUserForm.get('name')!.value!,
          },
        }),
      );
      this.newUserForm.reset();
    }
  }

  deleteUserById(id: number) {
    this.store.dispatch(
      UsersApiActions.deleteUser({
        id,
      }),
    );

    this.actions
      .pipe(
        ofType(UsersApiActions.deleteUserSuccess),
        filter((action) => action.id === id),
        take(1),
      )
      .subscribe(() => {
        const userFormArray = this.userListForm.get('users') as FormArray;
        const usersArrayControls = this.usersFormArray();
        const index = usersArrayControls.findIndex((c) => c.get('id')?.value === id);
        if (index !== -1) userFormArray.removeAt(index);
      });
  }

  editUser(id: number) {
    const formArray = this.usersFormArray();
    const index = formArray.findIndex((ctrl) => ctrl.get('id')?.value === id);

    if (formArray && index !== -1) {
      const nameCtrl = formArray.at(index)?.get('name');
      nameCtrl?.enable();
    }
  }

  updateUser(user: User) {
    const controls = this.usersFormArray();
    const index = controls.findIndex((ctrl) => ctrl.get('id')?.value === user.id);

    if (index === -1) return; // контрол не найден

    const grp = controls.at(index);
    const nameCtrl = grp?.get('name');

    if (grp?.valid) {
      this.store.dispatch(UsersApiActions.updateUser({ user }));
      nameCtrl?.disable();
    } else {
      nameCtrl?.markAsTouched();
    }
  }

  selectUser(user: User) {
    this.store.dispatch(UsersApiActions.setSelectedUser({ id: user.id }));
  }
}
