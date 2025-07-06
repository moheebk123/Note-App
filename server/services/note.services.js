import { Note } from "../models/notes.model.js";

export const loadNotes = async ({ limit = 10, skip = 0, createdBy }) => {
  const notes = await Note.find({ createdBy })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const totalNotes = await Note.find({ createdBy }).countDocuments();

  return { notes, totalNotes };
};

export const addNote = async (note) => {
  return await Note.create(note);
};

export const getNoteById = async (id) => {
  return await Note.findById(id);
};

export const updateNote = async (id, updatedNote) => {
  return await Note.findByIdAndUpdate(id, updatedNote);
};

export const deleteNote = async (id) => {
  return await Note.findByIdAndDelete(id);
};

export const deleteUserNotes = async (createdBy) => {
  return await Note.deleteMany({ createdBy });
};
