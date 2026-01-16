import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
  items: localStorage.getItem('wishlist') 
    ? JSON.parse(localStorage.getItem('wishlist')) 
    : [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem('wishlist', JSON.stringify(state.items));
        toast.success("❤️ Agregado a tu lista de deseos");
      } else {
        toast.info("Ya está en tu lista de deseos");
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
      toast.warn("💔 Eliminado de la lista de deseos");
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;