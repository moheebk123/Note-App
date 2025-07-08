import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import * as utils from "../utils/index.utils.js";
import * as services from "../services/index.services.js";
import { Request, Response } from "express";

interface GoogleClaims {
  sub: string;
  name: string;
  email: string;
  email_verified: boolean;
}

export const handleOAuthRedirect = async (req: Request, res: Response) => {
  if (req.user) {
    return res
      .status(403)
      .json({ message: "Already logged in", success: false });
  }
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 10 * 60 * 1000,
    };

    const url = utils.google.createAuthorizationURL(state, codeVerifier, [
      "openid",
      "profile",
      "email",
    ]);

    return res
      .status(200)
      .cookie("google_oauth_state", state, options)
      .cookie("google_code_verifier", codeVerifier, options)
      .redirect(url.toString());
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "Failed to redirect google login page. Please try again!",
      success: true,
    });
  }
};

export const handleOAuthCallback = async (req: Request, res: Response) => {
  const { query, cookies } = req;
  const { code, state } = query;
  const {
    google_oauth_state: storedState,
    google_code_verifier: codeVerifier,
  } = cookies;

  if (
    !code ||
    !state ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    return res.status(400).json({
      message:
        "Couldn't login with Google because of invalid login attempt. Please try again!",
      success: false,
    });
  }

  try {
    const tokens = await utils.google.validateAuthorizationCode(
      code as string,
      codeVerifier
    );
    const claims = decodeIdToken(tokens.idToken());
    const {
      sub: userId,
      name,
      email,
    } = claims as GoogleClaims;

    const user = await services.getUserWithOAuthProvider(email);

    if (user) {
      const oauthUserId = user.oauthUser?._id?.toString();
      if (oauthUserId) {
        await services.linkOAuthUser(oauthUserId, {
          provider: "google",
          providerAccountId: userId,
        });
      }

      const accessToken = services.generateToken(
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        "1m"
      );

      const refreshToken = services.generateToken(
        {
          id: user._id,
        },
        process.env.JWT_REFRESH_SECRET,
        "7d"
      );

      user.refreshToken = refreshToken;
      user.save({ validateBeforeSave: false });

      return res
        .status(200)
        .cookie("access_token", accessToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          maxAge: 15 * 60 * 1000, // 1 min
        })
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({ message: "Google login successfully", success: true });
    } else {
      const oauthUser = await services.createOAuthUser({
        provider: "google",
        providerAccountId: userId,
      });

      const newUser = await services.createUser({
        name,
        email,
        refreshToken: "",
        verificationCode: "",
        oauthUser: oauthUser._id,
        notes: [],
      });

      const accessToken = services.generateToken(
        {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        process.env.JWT_SECRET,
        "1m"
      );

      const refreshToken = services.generateToken(
        {
          id: newUser._id,
        },
        process.env.JWT_REFRESH_SECRET,
        "7d"
      );

      newUser.refreshToken = refreshToken;
      newUser.save({ validateBeforeSave: false });

      return res
        .status(200)
        .cookie("access_token", accessToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          maxAge: 15 * 60 * 1000, // 1 min
        })
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({ message: "Google login successfully", success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message:
        "Couldn't login with Google because of invalid login attempt. Please try again!",
      success: false,
    });
  }
};
