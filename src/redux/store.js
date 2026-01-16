import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
// 1. IMPORTAR EL REDUCER DE WISHLIST
import wishlistReducer from './wishlistSlice'; 

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    // 2. REGISTRARLO AQUÍ (El nombre 'wishlist' debe coincidir con lo que buscas en useSelector)
    wishlist: wishlistReducer, 
  },
});