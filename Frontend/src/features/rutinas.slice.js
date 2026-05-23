import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

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
      });
  },
});

export default rutinasSlice.reducer;
