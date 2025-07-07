import { Note } from "../models/notes.model.ts";

interface NoteInterface {
  title: string,
  description: string | null | undefined | "",
  createdBy: string
}

export const loadNotes = async ({ limit = 10, skip = 0, createdBy }: {createdBy: string, limit: number, skip: number}) => {
  const notes = await Note.find({ createdBy })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const totalNotes = await Note.find({ createdBy }).countDocuments();

  return { notes, totalNotes };
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

export const deleteUserNotes = async (createdBy: StringPayload) => {
  return await Note.deleteMany({ createdBy });
};
