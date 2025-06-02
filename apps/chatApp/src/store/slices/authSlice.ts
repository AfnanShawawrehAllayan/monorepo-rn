import { createSlice } from '@reduxjs/toolkit';

import { storage } from '../../utils/storage';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: storage.getItem<string>('token'),
  isAuthenticated: !!storage.getItem<string>('token'),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload: { token } }) => {
      state.token = token;
      state.isAuthenticated = true;
      storage.setItem('token', token);
    },
    logout: state => {
      state.token = null;
      state.isAuthenticated = false;
      storage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
