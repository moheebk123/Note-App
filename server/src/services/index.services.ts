import {
  hashPassword,
  isPasswordCorrect,
  generateToken,
  verifyToken,
  generateVerifyCode,
} from "./auth.services.ts";

import { sendVerificationCode, sendResetPassword } from "./email.services.ts";

import {
  loadNotes,
  addNote,
  getNoteById,
  updateNote,
  deleteNote,
} from "./note.services.ts";

import {
  createOAuthUser,
  linkOAuthUser,
  deleteOAuthUser,
} from "./oauthUsers.services.ts";

import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByResetPasswordToken,
  getUserWithOAuthProvider,
  pushNote,
  updateRefreshToken,
  updateVerification,
} from "./user.services.ts";

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
};
