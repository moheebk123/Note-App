import { Types } from "mongoose";
import { OAuthInterface } from "./oauth.js";
import { NoteInterface } from "./note.js";

export interface UserType {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  refreshToken: string | "";
  verificationCode: string | "";
  notes: Array<Types.ObjectId | NoteInterface> | [];
  oauthUser: Types.ObjectId | OAuthInterface;
}
