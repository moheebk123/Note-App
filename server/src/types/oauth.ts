import { Types } from "mongoose";

export interface OAuthInterface {
  provider: "google" | "internal";
  providerAccountId: "internal" | string;
}
