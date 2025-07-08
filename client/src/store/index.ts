import { configureStore } from "@reduxjs/toolkit";
import alertSlice, { alertActions } from "./alert.js";
import userDataSlice, { userDataActions } from "./userData.js";
import themeSlice, {themeActions} from "./theme.js";

export const store = configureStore({
  reducer: {
    showAlert: alertSlice.reducer,
    userData: userDataSlice.reducer,
    theme: themeSlice.reducer
  },
});

export { alertActions, userDataActions, themeActions };
