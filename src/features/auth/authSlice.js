import { createSlice } from '@reduxjs/toolkit';

const MOCK_USER = { email: 'demo@store.com', password: 'demo123', name: 'Demo User' };

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    error: null,
  },
  reducers: {
    login(state, action) {
      const { email, password } = action.payload;
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        state.isAuthenticated = true;
        state.user = { email: MOCK_USER.email, name: MOCK_USER.name };
        state.error = null;
      } else {
        state.error = 'Invalid credentials. Use demo@store.com / demo123';
      }
    },
    signup(state, action) {
      const { name, email } = action.payload;
      state.isAuthenticated = true;
      state.user = { name, email };
      state.error = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { login, signup, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
