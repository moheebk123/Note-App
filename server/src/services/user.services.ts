import { UserType } from "src/types/user.ts";
import { User } from "../models/users.model.ts";

export const createUser = async (newUser: UserType) => {
  return await User.create(newUser);
};

export const getUserByEmail = async (email: StringPayload) => {
  return await User.findOne({ email });
};

export const getUserById = async (userId: StringPayload) => {
  return await User.findById(userId).populate("notes");
};

export const getUserByResetPasswordToken = async (resetPasswordToken: StringPayload) => {
  return await User.findOne({ resetPasswordToken });
};

export const getUserWithOAuthProvider = async (email: String) => {
  return await User.findOne({ email }).populate("oauthUser");
};

export const pushNote = async (userId: StringPayload, newNoteId: StringPayload) => {
  await User.findByIdAndUpdate(userId, {
    $push: { notes: newNoteId },
  });
};

export const updateRefreshToken = async (userId: StringPayload, refreshToken: StringPayload | "" = "") => {
  await User.findByIdAndUpdate(userId, {
    $set: { refreshToken },
  });
};

export const updateVerification = async (
  userId: StringPayload,
  verificationCode: StringPayload | "" = "",
  isVerified: boolean = false
) => {
  await User.findByIdAndUpdate(userId, {
    $set: { verificationCode, isVerified },
  });
};

export const updateUserProfile = async (userId: StringPayload, name: StringPayload) => {
  return await User.findByIdAndUpdate(userId, {
    $set: { name },
  });
};

export const updatePassword = async (userId: StringPayload, password: StringPayload) => {
  return await User.findByIdAndUpdate(userId, {
    $set: { password },
  });
};

export const deleteUser = async (userId: StringPayload) => {
  return await User.findByIdAndDelete(userId);
};
