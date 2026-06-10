import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth.slice";
import rutinasReducer from "../features/rutinas.slice";
import ejerciciosReducer from "../features/ejercicios.slice";
import categoriasReducer from "../features/categorias.slice";
import adminReducer from "../features/admin.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rutinas: rutinasReducer,
    ejercicios: ejerciciosReducer,
    categorias: categoriasReducer,
    admin: adminReducer,
  },
});
