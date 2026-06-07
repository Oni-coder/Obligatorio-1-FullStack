import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import { logout } from "./auth.slice";

export const fetchCategorias = createAsyncThunk(
  "categorias/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/categorias");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al cargar categorías");
    }
  }
);

const categoriasSlice = createSlice({
  name: "categorias",
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.categorias;
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout, () => ({ data: [], loading: false, error: null }));
  },
});

export default categoriasSlice.reducer;
