import { createSlice } from '@reduxjs/toolkit';

// Verificar si ya hay un usuario guardado al iniciar
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

const initialState = {
  token: token || null,
  user: user ? JSON.parse(user) : null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user; // Guardamos datos del usuario (username, email)
      state.isAuthenticated = true;
      
      // Guardar en el navegador para que no se cierre al recargar
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      
      // Limpiar navegador
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;