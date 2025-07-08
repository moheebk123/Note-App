import { createSlice } from "@reduxjs/toolkit";

const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    isCheckingAuth: true,
    isAuthenticated: false,
  },
  reducers: {
    updateUser: (_, action) =>
      action.payload
        ? { ...action.payload, isCheckingAuth: false, isAuthenticated: true }
        : { isCheckingAuth: false, isAuthenticated: false },
  },
});

export const userDataActions = userDataSlice.actions;
export default userDataSlice;
