import crypto from "crypto";

import argon2 from "argon2";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

type Expiry = SignOptions["expiresIn"];

export const generateToken = (
  payload: object,
  secret: Secret = process.env.JWT_SECRET as string,
  expiresIn: Expiry
) => {
  const options: SignOptions = {
    expiresIn,
  };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (
  token: StringPayload,
  secret: Secret = process.env.JWT_SECRET as string
) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const generateVerifyCode = (digit = 8) => {
  const min = 10 ** (digit - 1); // 10000000
  const max = 10 ** digit; // 100000000

  return crypto.randomInt(min, max).toString();
};
