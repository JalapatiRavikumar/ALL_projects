import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const res = await fetch('https://fakestoreapi.com/products');
  return res.json();
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const res = await fetch('https://fakestoreapi.com/products/categories');
  return res.json();
});

export const fetchProductsByCategory = createAsyncThunk('products/fetchByCategory', async (category) => {
  const res = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`);
  return res.json();
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id) => {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  return res.json();
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    categories: [],
    selectedProduct: null,
    status: 'idle',
    categoryStatus: 'idle',
    productStatus: 'idle',
    error: null,
    selectedCategory: 'all',
    sortBy: 'default',
    searchQuery: '',
  },
  reducers: {
    setCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchProductsByCategory.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => { state.productStatus = 'loading'; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productStatus = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state) => { state.productStatus = 'failed'; });
  },
});

export const { setCategory, setSortBy, setSearchQuery, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
