import { configureStore } from "@reduxjs/toolkit";
import alertSlice, { alertActions } from "./alert.js";
import userDataSlice, { userDataActions } from "./userData.js";

export const store = configureStore({
  reducer: {
    showAlert: alertSlice.reducer,
    userData: userDataSlice.reducer,
  },
});

export { alertActions, userDataActions};
