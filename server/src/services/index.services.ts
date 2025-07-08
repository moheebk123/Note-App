import {
  generateToken,
  verifyToken,
  generateVerifyCode,
} from "./auth.services.js";

import { sendVerificationCode } from "./email.services.js";

import {
  loadNotes,
  addNote,
  getNoteById,
  updateNote,
  deleteNote,
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
} from "./user.services.js";

export {
  generateToken,
  verifyToken,
  generateVerifyCode,
  sendVerificationCode,
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
