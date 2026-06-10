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

export const createEjercicio = createAsyncThunk(
  "ejercicios/create",
  async (ejercicioData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/ejercicios", ejercicioData);
      return data.ejercicio;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al crear ejercicio");
    }
  }
);

export const updateEjercicio = createAsyncThunk(
  "ejercicios/update",
  async ({ id, data: ejercicioData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/ejercicios/${id}`, ejercicioData);
      return data.ejercicio;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al actualizar ejercicio");
    }
  }
);

export const deleteEjercicio = createAsyncThunk(
  "ejercicios/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/ejercicios/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al eliminar ejercicio");
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
      .addCase(createEjercicio.fulfilled, (state, action) => {
        if (action.payload) state.data.unshift(action.payload);
      })
      .addCase(updateEjercicio.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.data.findIndex((e) => e._id === action.payload._id);
          if (idx !== -1) state.data[idx] = action.payload;
        }
      })
      .addCase(deleteEjercicio.fulfilled, (state, action) => {
        state.data = state.data.filter((e) => e._id !== action.payload);
      })
      .addCase(logout, () => ({ data: [], loading: false, error: null }));
  },
});

export default ejerciciosSlice.reducer;
