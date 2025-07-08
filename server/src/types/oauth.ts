import { Types } from "mongoose";

export interface OAuthInterface {
  _id?: Types.ObjectId;
  provider: "google" | "internal";
  providerAccountId: "internal" | string;
}
