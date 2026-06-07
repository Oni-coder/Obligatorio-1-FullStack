import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import { logout } from "./auth.slice";

export const fetchRutinas = createAsyncThunk(
  "rutinas/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/rutinas", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al cargar rutinas");
    }
  }
);

export const createRutina = createAsyncThunk(
  "rutinas/create",
  async (rutinaData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/rutinas", rutinaData);
      return data.rutina;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al crear rutina");
    }
  }
);

export const updateRutina = createAsyncThunk(
  "rutinas/update",
  async ({ id, data: rutinaData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/rutinas/${id}`, rutinaData);
      return data.rutina;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al actualizar rutina");
    }
  }
);

export const deleteRutina = createAsyncThunk(
  "rutinas/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/rutinas/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al eliminar rutina");
    }
  }
);

const rutinasSlice = createSlice({
  name: "rutinas",
  initialState: {
    data: [],
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRutinas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRutinas.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchRutinas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRutina.fulfilled, (state, action) => {
        if (action.payload) {
          state.data.unshift(action.payload);
          state.total += 1;
        }
      })
      .addCase(updateRutina.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.data.findIndex((r) => r._id === action.payload._id);
          if (idx !== -1) state.data[idx] = action.payload;
        }
      })
      .addCase(deleteRutina.fulfilled, (state, action) => {
        state.data = state.data.filter((r) => r._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(logout, () => ({
        data: [], total: 0, totalPages: 0, page: 1, limit: 10, loading: false, error: null,
      }));
  },
});

export default rutinasSlice.reducer;
