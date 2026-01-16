import { createSlice } from '@reduxjs/toolkit';

// Intentamos cargar el carrito guardado del navegador
const loadCartFromStorage = () => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

const initialState = {
  items: loadCartFromStorage(), // Array de productos en el carrito
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      // Verificamos si el producto ya está en el carrito
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        // Si ya existe, aumentamos la cantidad
        existingItem.quantity += 1;
      } else {
        // Si es nuevo, lo agregamos con cantidad 1
        state.items.push({ ...product, quantity: 1 });
      }
      
      // Guardar en localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    }
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;