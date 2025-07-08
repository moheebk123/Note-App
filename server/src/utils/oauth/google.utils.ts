import { Google } from "arctic";

export const google = new Google(
  String(process.env.GOOGLE_CLIENT_ID),
  String(process.env.GOOGLE_CLIENT_SECRET),
  `${process.env.ORIGIN}/oauth/google/callback`
);
