import { Request, Response } from "express";
import * as services from "../services/index.services.js";
import { UserType } from "src/types/user.js";

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const existedUser = await services.getUserByEmail(email);
    if (existedUser) {
      return res.status(400).json({
        message: "User with this credentials already exist",
        success: false,
      });
    }

    const oauthUser = await services.createOAuthUser({
      provider: "internal",
      providerAccountId: "internal",
    });

    const user = await services.createUser({
      name,
      email,
      refreshToken: "",
      verificationCode: "",
      oauthUser: oauthUser._id,
      notes: [],
    });
    if (!user) {
      return res.status(403).json({
        message: "Failed to register. Please try again!",
        success: false,
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
        secure: true, // true in production
        maxAge: 15 * 60 * 1000, // 1 min
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: true, // true in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error. Please try again!",
      success: false,
    });
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const existedUser = await services.getUserByEmail(email);
    if (!existedUser) {
      return res
        .status(404)
        .json({ message: "User doesn't exist", success: false });
    }

    if (existedUser.oauthUser) {
      await services.linkOAuthUser(existedUser.oauthUser.toString(), {
        provider: "internal",
        providerAccountId: "internal",
      });

      const accessToken = services.generateToken(
        {
          id: existedUser.id,
          name: existedUser.name,
          email: existedUser.email,
        },
        process.env.JWT_SECRET,
        "1m"
      );

      const refreshToken = services.generateToken(
        {
          id: existedUser.id,
        },
        process.env.JWT_REFRESH_SECRET,
        "7d"
      );

      existedUser.refreshToken = refreshToken;
      existedUser.save({ validateBeforeSave: false });

      return res
        .status(200)
        .cookie("access_token", accessToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: true, // true in production
          maxAge: 15 * 60 * 1000, // 1 min
        })
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: true, // true in production
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({ message: "User login successfully", success: true });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const handleLogout = async (req: Request, res: Response) => {
  const { user } = req;
  if (!user) {
    return res
      .status(400)
      .json({ message: "Not authenticated to logout", success: false });
  }

  if (user._id) {
    await services.updateRefreshToken(user._id.toString());

    return res
      .status(200)
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .json({ message: "User logout successfully", success: true });
  }
};

export const handleSendOtp = async (req: Request, res: Response) => {
  const { user } = req;
  if (!user) {
    return res.status(401).json({
      message: "Not authenticated to receive OTP",
      success: false,
    });
  }

  const verificationCode = services.generateVerifyCode();
  if (user._id) {
    try {
      // const response = await services.sendVerificationCode(
      //   user.email,
      //   verificationCode
      // );
      await services.updateVerification(
        user._id.toString(),
        verificationCode
      );
        return res.status(200).json({
          message: "Failed to send code. Please try again!",
          success: true,
          otp: verificationCode
        });
      // if (response) {
      //   return res.status(200).json({
      //     message: "Code sent successfully",
      //     success: true
      //   });
      // } else {
      //   return res.status(400).json({
      //     message: "Failed to send code. Please try again!",
      //     success: false,
      //     otp: loggedUser.verificationCode
      //   });
      // }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error. Please try again!",
        success: false,
      });
    }
  }
};

export const handleVerifyEmail = async (req: Request, res: Response) => {
  const { user, body } = req;

  if (!user) {
    return res.status(400).json({
      message: "Not authenticated to verify email",
      success: false,
    });
  }

  const { verifyCode } = body;
  if (!verifyCode) {
    return res.status(400).json({
      message: "Verification code is required",
      success: false,
    });
  }

  const verificationCode = body.verifyCode;
  if (user._id && verificationCode === user.verificationCode) {
    await services.updateVerification(user._id.toString(), "");

    const { _id, name, email, notes } = user;
    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
      user: { _id, name, email, notes },
    });
  }
  return res.status(400).json({
    message: "Invalid verification code",
    success: false,
  });
};

export const handleUserSession = async (req: Request, res: Response) => {
  if (req.user) {
    const { _id, name, email, notes } = req.user;
    return res
      .status(200)
      .json({ message: "", success: true, user: { _id, name, email, notes } });
    } else {
    return res
      .status(200)
      .json({ message: "", success: true, user: {} });
  }
};
