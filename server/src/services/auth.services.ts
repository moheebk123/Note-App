import crypto from "crypto";

import argon2 from "argon2";
import jwt, { SignOptions } from "jsonwebtoken";

type Expiry = SignOptions["expiresIn"]

export const hashPassword = async (password: StringPayload) => {
  return await argon2.hash(password);
};

export const isPasswordCorrect = async (
  password: StringPayload,
  hashedPassword: StringPayload
) => {
  return await argon2.verify(hashedPassword, password);
};

export const generateToken = (
  payload: object,
  secret: string | undefined = String(process.env.JWT_SECRET),
  expiresIn: Expiry
) => {
  const options: SignOptions = {
    expiresIn
  }
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: StringPayload, secret = process.env.JWT_SECRET) => {
  return jwt.verify(token, secret);
};

export const generateVerifyCode = (digit = 8) => {
  const min = 10 ** (digit - 1); // 10000000
  const max = 10 ** digit; // 100000000

  return crypto.randomInt(min, max).toString();
};
