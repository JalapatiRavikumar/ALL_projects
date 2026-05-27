import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'orders';

function safeParseOrders() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: safeParseOrders(),
  },
  reducers: {
    addOrder(state, action) {
      state.orders.unshift(action.payload);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.orders));
      }
    },
    clearOrders(state) {
      state.orders = [];
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    },
  },
});

export const { addOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;

