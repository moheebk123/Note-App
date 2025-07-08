import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: window.matchMedia("(prefers-color-scheme: dark)").matches,
  reducers: {
    toggleTheme: (state) => (state = !state),
  },
});

export const themeActions = themeSlice.actions;
export default themeSlice;
