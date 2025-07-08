import { NextFunction, Request, Response } from "express";
import * as services from "../services/index.services.js";
import { UserType } from "src/types/user.js";

export const verifyAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req.cookies;
  if (!access_token && !refresh_token) {
    req.user = null;
    return next();
  }

  try {
    const decodedAccessToken = services.verifyToken(access_token);
    const loggedUser: UserType = await services.getUserById(decodedAccessToken?.id) as UserType;
    if (loggedUser) {
      req.user = loggedUser;
    }

    return next();
  } catch (error) {
    if (refresh_token) {
      try {
        const decodedRefreshToken = services.verifyToken(
          refresh_token,
          process.env.JWT_REFRESH_SECRET
        );

        if (!decodedRefreshToken) {
          req.user = null;
          return next();
        }

        const loggedUser: UserType = await services.getUserById(decodedRefreshToken?.id) as UserType;

        if (loggedUser) {
          const newAccessToken = services.generateToken(
            {
              id: loggedUser._id,
              name: loggedUser.name,
              email: loggedUser.email,
            },
            process.env.JWT_SECRET,
            "1m"
          );

          req.user = loggedUser;
          res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
          });
          return next();
        }
      } catch (error) {
        req.user = null;
        return next();
      }
    }
    req.user = null;
    return next();
  }
};
