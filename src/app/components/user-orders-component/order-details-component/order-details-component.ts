import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Store } from '@ngrx/store';

import { appFeature } from '@store/app/app.feature';

@Component({
  selector: 'app-order-details-component',
  imports: [],
  templateUrl: './order-details-component.html',
  styleUrl: './order-details-component.scss',
})
export class OrderDetailsComponent {
  private readonly store = inject(Store);
  userWithOrdersSummary = toSignal(this.store.select(appFeature.selectUserWithOrdersSummary), {
    initialValue: null,
  });
}
