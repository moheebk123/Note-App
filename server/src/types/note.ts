import { Types } from "mongoose";

export interface NoteInterface {
  _id?: Types.ObjectId;
  title: string;
  description: string | null | undefined | "";
  createdBy: Types.ObjectId;
}
