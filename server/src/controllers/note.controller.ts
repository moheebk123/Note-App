import * as services from "../services/index.services.js";
import { Request, Response } from "express";

export const handleUserNotes = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({
        message: "Not authenticated to get notes",
        success: false,
      });
    }

    if (user._id) {
      const notes = await services.loadNotes({
        createdBy: user._id.toString(),
      });

      return res.status(200).json({
        message: "Notes loaded successfully",
        success: true,
        notes,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error. Please try again!",
      success: false,
    });
  }
};

export const handleAddNote = async (req: Request, res: Response) => {
  try {
    const { user, body } = req;

    if (user) {
      const { title, description } = body;

      if (!title) {
        return res.status(400).json({
          message: "Title required",
          success: false,
        });
      }

      if (user._id) {
        const newNote = await services.addNote({
          description,
          title,
          createdBy: user._id,
        });

        if (newNote) {
          await services.pushNote(user._id.toString(), newNote._id.toString());
        }

        return res.status(200).json({
          message: "Note added successfully",
          success: true,
        });
      }
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error. Please try again!",
      success: false,
    });
  }
};

export const handleEditNote = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({
        message: "Not authenticated to edit note",
        success: false,
      });
    }

    const { id } = req.params;
    const note = await services.getNoteById(id);

    if (note && user._id?.toString() === note.createdBy?.toString()) {
      const { title, description } = req.body;

      if (!title) {
        return res.status(400).json({
          message: "Title is required",
          success: false,
        });
      }
      note.title = title;
      if (description && description.length > 0) {
        note.description = description;
      }
      note.save({ validateBeforeSave: false });

      return res.status(200).json({
        message: "Note updated successfully",
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "Note does not found",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error. Please try again!",
      success: false,
    });
  }
};

export const handleDeleteNote = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({
        message: "Not authenticated to delete note",
        success: false,
      });
    }

    const { id } = req.params;
    const note = await services.getNoteById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note is not present",
        success: false,
      });
    }

    if (
      note &&
      note.createdBy &&
      user._id &&
      user._id.toString() === note.createdBy.toString()
    ) {
      await services.deleteNote(note?._id?.toString());
      return res.status(200).json({
        message: "Note deleted successfully",
        success: true,
      });
    } else {
      return res.status(401).json({
        message: "Not authenticated to delete this note",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error. Please try again!",
      success: false,
    });
  }
};
