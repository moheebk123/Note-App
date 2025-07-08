import { OAuthInterface } from "src/types/oauth.js";
import { OAuthUser } from "../models/oauthUsers.model.js";
import { ObjectId } from "mongoose";

export const createOAuthUser = async (newOAuthUser: OAuthInterface) => {
  return await OAuthUser.create(newOAuthUser);
};

export const linkOAuthUser = async (
  oauthUserId: StringPayload | ObjectId,
  updatedOAuthUser: OAuthInterface | object = {}
) => {
  await OAuthUser.findByIdAndUpdate(oauthUserId, {
    $set: updatedOAuthUser,
  });
};

export const deleteOAuthUser = async (oauthUserId: StringPayload | ObjectId) => {
  return await OAuthUser.findByIdAndDelete(oauthUserId);
};
