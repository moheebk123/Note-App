import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already present"],
      lowercase: true,
    },
    refreshToken: String,
    verificationCode: {
      type: String,
      maxLength: 8,
      default: "",
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "notes",
      },
    ],
    oauthUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "oauth_user",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("user", userSchema);
