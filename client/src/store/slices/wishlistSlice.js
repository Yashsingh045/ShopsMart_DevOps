import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/wishlist');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.error || 'Failed to fetch wishlist');
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async ({ folderId, productId }, { rejectWithValue }) => {
  try {
    const response = await api.post('/wishlist/items', { folderId, productId });
    return { folderId, item: response.data };
  } catch (error) {
    return rejectWithValue(error.response.data.error || 'Failed to add to wishlist');
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async ({ folderId, productId }, { rejectWithValue }) => {
  try {
    await api.delete(`/wishlist/items/${folderId}/${productId}`);
    return { folderId, productId };
  } catch (error) {
    return rejectWithValue(error.response.data.error || 'Failed to remove from wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    folders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.folders = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const folder = state.folders.find(f => f.id === action.payload.folderId);
        if (folder) {
          folder.items.push(action.payload.item);
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const folder = state.folders.find(f => f.id === action.payload.folderId);
        if (folder) {
          folder.items = folder.items.filter(item => item.productId !== action.payload.productId);
        }
      });
  },
});

export default wishlistSlice.reducer;
