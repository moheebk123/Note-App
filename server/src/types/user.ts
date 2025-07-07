import { Types } from "mongoose";
import { OAuthInterface } from "./oauth";
import { NoteInterface } from "./note";

export interface UserType {
  name: string;
  email: string;
  password: string | "";
  refreshToken: string | "";
  resetPasswordToken: string | "";
  verificationCode: string | "";
  isVerified: boolean;
  notes: Array<Types.ObjectId | NoteInterface> | [];
  oauthUser: Types.ObjectId | OAuthInterface;
}
