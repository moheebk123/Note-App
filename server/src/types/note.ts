import { Types } from "mongoose";

export interface NoteInterface {
  title: string;
  description: string | null | undefined | "";
  createdBy: Types.ObjectId;
}
