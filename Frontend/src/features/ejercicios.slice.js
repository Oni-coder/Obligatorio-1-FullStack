import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import { logout } from "./auth.slice";

export const fetchEjercicios = createAsyncThunk(
  "ejercicios/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/ejercicios");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al cargar ejercicios");
    }
  }
);

const ejerciciosSlice = createSlice({
  name: "ejercicios",
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEjercicios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEjercicios.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.ejercicios;
      })
      .addCase(fetchEjercicios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout, () => ({ data: [], loading: false, error: null }));
  },
});

export default ejerciciosSlice.reducer;
