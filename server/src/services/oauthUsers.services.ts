import { OAuthUser } from "../models/oauthUsers.model.ts";

interface OAuthInterface {
  provider: "google" | "internal";
  providerAccountId: "internal" | string;
}

export const createOAuthUser = async (newOAuthUser: OAuthInterface) => {
  return await OAuthUser.create(newOAuthUser);
};

export const linkOAuthUser = async (
  oauthUserId: StringPayload,
  updatedOAuthUser: OAuthInterface | object = {}
) => {
  await OAuthUser.findByIdAndUpdate(oauthUserId, {
    $set: updatedOAuthUser,
  });
};

export const deleteOAuthUser = async (oauthUserId: StringPayload) => {
  return await OAuthUser.findByIdAndDelete(oauthUserId);
};
