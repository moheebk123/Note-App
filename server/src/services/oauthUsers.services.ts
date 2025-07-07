import { OAuthInterface } from "src/types/oauth.ts";
import { OAuthUser } from "../models/oauthUsers.model.ts";

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
