import {
  hashPassword,
  isPasswordCorrect,
  generateToken,
  verifyToken,
  generateVerifyCode,
} from "./auth.services.js";

import { sendVerificationCode, sendResetPassword } from "./email.services.js";

import {
  loadNotes,
  addNote,
  getNoteById,
  updateNote,
  deleteNote,
  deleteUserNotes,
} from "./note.services.js";

import {
  createOAuthUser,
  linkOAuthUser,
  deleteOAuthUser,
} from "./oauthUsers.services.js";

import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByResetPasswordToken,
  getUserWithOAuthProvider,
  pushNote,
  updateRefreshToken,
  updateVerification,
  updateUserProfile,
  updatePassword,
  deleteUser,
} from "./user.services.js";

export {
  hashPassword,
  isPasswordCorrect,
  generateToken,
  verifyToken,
  generateVerifyCode,
  sendVerificationCode,
  sendResetPassword,
  loadNotes,
  addNote,
  getNoteById,
  updateNote,
  deleteNote,
  deleteUserNotes,
  createOAuthUser,
  linkOAuthUser,
  deleteOAuthUser,
  createUser,
  getUserByEmail,
  getUserById,
  getUserByResetPasswordToken,
  getUserWithOAuthProvider,
  pushNote,
  updateRefreshToken,
  updateVerification,
  updateUserProfile,
  updatePassword,
  deleteUser,
};
