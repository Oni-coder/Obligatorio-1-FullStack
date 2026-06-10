import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import { logout } from "./auth.slice";

export const fetchUsuarios = createAsyncThunk(
  "admin/fetchUsuarios",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/usuarios");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al cargar usuarios");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: { usuarios: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.usuarios = action.payload.usuarios;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout, () => ({ usuarios: [], loading: false, error: null }));
  },
});

export default adminSlice.reducer;
