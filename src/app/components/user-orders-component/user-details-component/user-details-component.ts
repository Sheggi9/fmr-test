import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Store } from '@ngrx/store';

import { appFeature } from '@store/app/app.feature';

@Component({
  selector: 'app-user-details-component',
  imports: [],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.scss',
})
export class UserDetailsComponent {
  private readonly store = inject(Store);
  selectedUser = toSignal(this.store.select(appFeature.selectSelectedUser), { initialValue: null });
  selectSelectedUserDetailsLoading = toSignal(
    this.store.select(appFeature.selectSelectedUserDetailsLoading),
    { initialValue: false },
  );
  selectSelectedUserDetails = toSignal(this.store.select(appFeature.selectSelectedUserDetails), {
    initialValue: null,
  });
  ordersForSelectedUser = toSignal(this.store.select(appFeature.selectOrdersForSelectedUser), {
    initialValue: [],
  });
  userWithOrdersSummary = toSignal(this.store.select(appFeature.selectUserWithOrdersSummary), {
    initialValue: null,
  });
}
