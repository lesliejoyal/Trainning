import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, size } = action.payload;
      const existing = state.items.find(item => item.product.id === product.id && item.size === size);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product, size, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const { id, size } = action.payload;
      state.items = state.items.filter(item => !(item.product.id === id && item.size === size));
    },
    updateQuantity: (state, action) => {
      const { id, size, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === id && item.size === size);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
