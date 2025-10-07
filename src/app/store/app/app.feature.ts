import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { Order } from '@models/order.models';
import { User } from '@models/user.models';

import { OrdersApiActions, UsersApiActions } from './app.actions';

export const appFeatureKey = 'app';

export const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const ordersAdapter = createEntityAdapter<Order>({
  selectId: (order) => order.id,
  sortComparer: (a, b) => a.id - b.id,
});

export interface UsersState extends EntityState<User> {
  loading: boolean;
}

export interface OrdersState extends EntityState<Order> {
  loading: boolean;
}

export interface AppState {
  users: UsersState;
  orders: OrdersState;
  selectedUserId: number | null;
  selectedUserDetailsLoading: boolean;
  selectedUserDetails: string | null;
}

const initialState: AppState = {
  users: usersAdapter.getInitialState({ loading: false }),
  orders: ordersAdapter.getInitialState({ loading: false }),
  selectedUserId: null,
  selectedUserDetailsLoading: false,
  selectedUserDetails: null,
};

export const appFeature = createFeature({
  name: appFeatureKey,
  reducer: createReducer(
    initialState,
    on(UsersApiActions.requestStart, (state) => ({
      ...state,
      users: { ...state.users, loading: true },
    })),
    on(UsersApiActions.requestEnd, (state) => ({
      ...state,
      users: { ...state.users, loading: false },
    })),

    on(UsersApiActions.loadUsersSuccess, (state, { users }) => ({
      ...state,
      users: usersAdapter.setAll(users, state.users),
    })),
    on(UsersApiActions.addUserSuccess, (state, { user }) => ({
      ...state,
      users: usersAdapter.addOne(user, state.users),
    })),
    on(UsersApiActions.updateUserSuccess, (state, { update }) => ({
      ...state,
      users: usersAdapter.updateOne(update, state.users),
    })),
    on(UsersApiActions.deleteUserSuccess, (state, { id }) => ({
      ...state,
      users: usersAdapter.removeOne(id, state.users),
      orders: ordersAdapter.removeMany(
        Object.values(state.orders.entities)
          .filter((o) => o!.userId === id)
          .map((o) => o!.id),
        state.orders,
      ),
      selectedUserId: state.selectedUserId === id ? null : state.selectedUserId,
      selectedUserDetails: state.selectedUserId === id ? null : state.selectedUserDetails,
    })),
    on(UsersApiActions.setSelectedUser, (state, { id }) => ({
      ...state,
      selectedUserId: id,
    })),
    on(UsersApiActions.setUserDetails, (state, { userDetails }) => ({
      ...state,
      selectedUserDetails: userDetails,
    })),
    on(UsersApiActions.startLoadUserDetails, (state) => ({
      ...state,
      selectedUserDetailsLoading: true,
    })),
    on(UsersApiActions.endLoadUserDetails, (state) => ({
      ...state,
      selectedUserDetailsLoading: false,
    })),

    on(OrdersApiActions.loadOrdersStart, (state) => ({
      ...state,
      orders: { ...state.orders, loading: true },
    })),
    on(OrdersApiActions.loadOrdersSuccess, (state, {orders}) => ({
      ...state,
      orders: ordersAdapter.setAll(orders, state.orders),
    })),
    on(OrdersApiActions.loadOrdersEnd, (state) => ({
      ...state,
      orders: { ...state.orders, loading: false },
    })),
  ),

  extraSelectors: ({ selectAppState }) => {
    const selectUsersState = createSelector(selectAppState, (state) => state.users);
    const selectOrdersState = createSelector(selectAppState, (state) => state.orders);

    //TODO:  Memorized selectors for users and orders
    const userSelectors = usersAdapter.getSelectors(selectUsersState);
    const orderSelectors = ordersAdapter.getSelectors(selectOrdersState);

    return {
      selectAllUsers: userSelectors.selectAll,
      selectUserEntities: userSelectors.selectEntities,
      selectUserIds: userSelectors.selectIds,
      selectUsersTotal: userSelectors.selectTotal,

      selectAllOrders: orderSelectors.selectAll,
      selectOrderEntities: orderSelectors.selectEntities,
      selectOrderIds: orderSelectors.selectIds,
      selectOrdersTotal: orderSelectors.selectTotal,

      selectLoadingUsers: createSelector(selectAppState, (state) => state.users.loading),

      selectLoadingOrders: createSelector(selectAppState, (state) => state.orders.loading),

      selectSelectedUser: createSelector(selectAppState, (state) =>
        state.selectedUserId !== null ? state.users.entities[state.selectedUserId] : null,
      ),

      selectOrdersForSelectedUser: createSelector(selectAppState, (state) =>
        state.selectedUserId !== null
          ? Object.values(state.orders.entities).filter((o) => o?.userId === state.selectedUserId)
          : [],
      ),

      selectUserWithOrdersSummary: createSelector(selectAppState, (state) => {
        const selectedUserId = state.selectedUserId;
        const user = selectedUserId !== null ? state.users.entities[selectedUserId] : null;
        if (!user) return null;

        const orders = Object.values(state.orders.entities).filter(
          (o) => o?.userId === selectedUserId,
        );
        const total = orders.reduce((sum, o) => sum + (o?.total ?? 0), 0);
        return { user, totalOrdersAmount: total };
      }),

      selectSelectedUserDetails: createSelector(
        selectAppState,
        (state) => state.selectedUserDetails,
      ),

      selectSelectedUserDetailsLoading: createSelector(
        selectAppState,
        (state) => state.selectedUserDetailsLoading,
      ),
    };
  },
});
