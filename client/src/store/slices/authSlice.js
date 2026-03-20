import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('shopsmart_token', response.data.token);
    return response.data.user;
  } catch (error) {
    return rejectWithValue(error.response.data.error || 'Login failed');
  }
});

export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/signup', userData);
    localStorage.setItem('shopsmart_token', response.data.token);
    return response.data.user;
  } catch (error) {
    return rejectWithValue(error.response.data.error || 'Signup failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('shopsmart_token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('shopsmart_token');
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(signup.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signup.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(signup.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
