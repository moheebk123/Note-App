import {
  handleUserNotes,
  handleAddNote,
  handleEditNote,
  handleDeleteNote,
} from "./note.controller.ts";

import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleResendVerificationLink,
  handleVerifyEmail,
  handleResetPassword,
  handleForgetPassword,
} from "./auth.controller.js";

import {
  handleOAuthRedirect,
  handleOAuthCallback,
} from "./oauth.controller.ts";

export {
  handleUserNotes,
  handleAddNote,
  handleEditNote,
  handleDeleteNote,
  handleRegister,
  handleLogin,
  handleLogout,
  handleResendVerificationLink,
  handleVerifyEmail,
  handleResetPassword,
  handleForgetPassword,
  handleOAuthRedirect,
  handleOAuthCallback,
};
