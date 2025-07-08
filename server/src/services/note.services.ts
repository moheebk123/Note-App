import { NoteInterface } from "src/types/note.js";
import { Note } from "../models/notes.model.js";
import { ObjectId } from "mongoose";

export const loadNotes = async ({ createdBy }: {createdBy: string | ObjectId}) => {
  return await Note.find({ createdBy })
    .sort({ createdAt: -1 });
};

export const addNote = async (note: NoteInterface) => {
  return await Note.create(note);
};

export const getNoteById = async (id: StringPayload | ObjectId) => {
  return await Note.findById(id);
};

export const updateNote = async (id: StringPayload | ObjectId, updatedNote: NoteInterface) => {
  return await Note.findByIdAndUpdate(id, updatedNote);
};

export const deleteNote = async (id: StringPayload | ObjectId) => {
  return await Note.findByIdAndDelete(id);
};
