import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

const decodeJWT = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};
//const
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const decoded = decodeJWT(data.token);
      return { token: data.token, user: { ...decoded, email, fotoPerfil: data.fotoPerfil || null } };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al iniciar sesión");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", { email, password });
      const decoded = decodeJWT(data.token);
      return { token: data.token, user: { ...decoded, email, fotoPerfil: data.fotoPerfil || null } };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al registrar usuario");
    }
  }
);
//
export const changePlan = createAsyncThunk(
  "auth/changePlan",
  async (_, { rejectWithValue }) => {
    try {
      await api.patch("/usuarios/plan", { plan: "premium" });
      return "premium";
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al cambiar de plan");
    }
  }
);

const persistAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken || null,
    user: storedUser ? JSON.parse(storedUser) : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserPhoto: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, fotoPerfil: action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };
    const handleAuthFulfilled = (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      persistAuth(action.payload.token, action.payload.user);
    };

    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleAuthFulfilled)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleAuthFulfilled)
      .addCase(registerUser.rejected, handleRejected)
      .addCase(changePlan.pending, handlePending)
      .addCase(changePlan.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user = { ...state.user, plan: action.payload };
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(changePlan.rejected, handleRejected);
  },
});

export const { logout, clearError, updateUserPhoto } = authSlice.actions;
export default authSlice.reducer;
