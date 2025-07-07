import { NoteInterface } from "src/types/note.ts";
import { Note } from "../models/notes.model.ts";

export const loadNotes = async ({ createdBy }: {createdBy: string}) => {
  return await Note.find({ createdBy })
    .sort({ createdAt: -1 });
};

export const addNote = async (note: NoteInterface) => {
  return await Note.create(note);
};

export const getNoteById = async (id: StringPayload) => {
  return await Note.findById(id);
};

export const updateNote = async (id: StringPayload, updatedNote: NoteInterface) => {
  return await Note.findByIdAndUpdate(id, updatedNote);
};

export const deleteNote = async (id: StringPayload) => {
  return await Note.findByIdAndDelete(id);
};
