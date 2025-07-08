import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
  name: "showAlert",
  initialState: {
    show: false,
    severity: "",
    message: "",
  },
  reducers: {
    showAlert: (_, action) =>
      action.payload
        ? action.payload
        : {
            show: false,
            severity: "",
            message: "",
          },
  },
});

export const alertActions = alertSlice.actions;
export default alertSlice;
