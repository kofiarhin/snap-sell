import { createSlice } from "@reduxjs/toolkit";

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
};

const isValidTheme = (value) => Object.values(THEME).includes(value);

export const getInitialTheme = () => {
  if (typeof window === "undefined") return THEME.DARK;

  const storedTheme = window.localStorage.getItem("snapsell-theme");
  if (isValidTheme(storedTheme)) return storedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEME.DARK : THEME.LIGHT;
};

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: getInitialTheme(),
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = isValidTheme(action.payload) ? action.payload : THEME.DARK;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === THEME.DARK ? THEME.LIGHT : THEME.DARK;
    },
  },
});

export const { setTheme, toggleTheme } = uiSlice.actions;

export default uiSlice.reducer;
