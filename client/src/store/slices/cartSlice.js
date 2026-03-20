import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.error || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.error || 'Failed to add to cart');
  }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/cart/${productId}`, { quantity });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.error || 'Failed to update cart');
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (productId, { rejectWithValue }) => {
  try {
    await api.delete(`/cart/${productId}`);
    return productId;
  } catch (error) {
    return rejectWithValue(error.response.data.error || 'Failed to remove from cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCartLocal: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addToCart.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.productId === action.payload.productId);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.productId === action.payload.productId);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.productId !== action.payload);
      });
  },
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
