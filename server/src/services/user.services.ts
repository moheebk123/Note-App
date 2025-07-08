import { UserType } from "src/types/user.js";
import { User } from "../models/users.model.js";
import { ObjectId } from "mongoose";

export const createUser = async (newUser: UserType) => {
  return await User.create(newUser);
};

export const getUserByEmail = async (email: StringPayload) => {
  return await User.findOne({ email });
};

export const getUserById = async (userId: StringPayload | ObjectId) => {
  return await User.findById(userId).populate("notes");
};

export const getUserByResetPasswordToken = async (
  resetPasswordToken: StringPayload
) => {
  return await User.findOne({ resetPasswordToken });
};

export const getUserWithOAuthProvider = async (email: String) => {
  return await User.findOne({ email }).populate("oauthUser");
};

export const pushNote = async (
  userId: StringPayload | ObjectId,
  newNoteId: StringPayload
) => {
  await User.findByIdAndUpdate(userId, {
    $push: { notes: newNoteId },
  });
};

export const updateRefreshToken = async (
  userId: StringPayload | ObjectId,
  refreshToken: StringPayload | "" = ""
) => {
  await User.findByIdAndUpdate(userId, {
    $set: { refreshToken },
  });
};

export const updateVerification = async (
  userId: StringPayload | ObjectId,
  verificationCode: StringPayload | "" = ""
) => {
  await User.findByIdAndUpdate(userId, {
    $set: { verificationCode },
  });
};
