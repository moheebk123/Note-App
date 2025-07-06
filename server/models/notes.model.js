import mongoose from "mongoose";

const note = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

export const Note = mongoose.model("notes", note);
