import { Request, Response } from "express";
import * as services from "../services/index.services.js";

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
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

    const hashedPassword = await services.hashPassword(password);

    const user = await services.createUser({
      name,
      email,
      password: hashedPassword,
      refreshToken: "",
      resetPasswordToken: "",
      isVerified: false,
      verificationCode: "",
      oauthUser: oauthUser._id,
      notes: [],
    });
    if (user) {
      const accessToken = services.generateToken(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        "1m"
      );

      const refreshToken = services.generateToken(
        {
          id: user.id,
        },
        process.env.JWT_REFRESH_SECRET,
        "7d"
      );

      user.refreshToken = refreshToken;
      user.save({ validateBeforeSave: false });

      return res
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
    }
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({
        message: "Internal Server Error. Please try again!",
        success: false,
      });
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if ((!email || !password)) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const existedUser = await services.getUserByEmail(email);
    if (!existedUser) {
      return res
        .status(404)
        .json({ message: "User doesn't exist", success: false });
    }

    if (!existedUser.password) {
      return res
        .status(400)
        .json({
          message:
            "You have created account using Google. Please login with Google",
          success: false,
        });
    }

    const isPasswordValid = await services.isPasswordCorrect(
      password,
      existedUser.password
    );
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid user credentials", success: false });
    }

    await services.linkOAuthUser(existedUser.oauthUser, {
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

    await services.updateRefreshToken(user._id);

  return res
    .status(200)
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .json({ message: "User logout successfully", success: true });
};

export const handleResendVerificationLink = async (req: Request, res: Response) => {
  const { user } = req;
  if (!user) {
    return res
      .status(400)
      .json({
        message: "Not authenticated to resend verify email",
        success: false,
      });
  }

  if (user.isVerified) {
    return res.status(403).json({
      message: "Email already verified",
      success: false,
    });
  }

  const verificationCode = services.generateVerifyCode();
  await services.updateVerification(user._id, verificationCode);
  return res.status(200).json({
    message: "Code sent successfully",
    success: true,
  });
};

export const handleVerifyEmail = async (req: Request, res: Response) => {
  const { user, body } = req;

  if (!user) {
    return res.status(400).json({
      message: "Not authenticated to verify email",
      success: false,
    });
  }

  if (user.isVerified) {
    return res.status(403).json({
      message: "Email already verified",
      success: false,
    });
  }

  const verificationCode = body.verifyCode;
  if (verificationCode === user.verificationCode) {
    await services.updateVerification(user._id, "", true);

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  }
  return res.status(400).json({
    message: "Invalid verification code",
    success: false,
  });
};

export const handleResetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || email.length === 0) {
    return res.status(400).json({
      message: "Email is required to send reset password mail",
      success: false,
    });
  }

  try {
    const existedUser = await services.getUserByEmail(email);
    if (existedUser) {
      const resetPasswordToken = services.generateToken(
        {
          email: existedUser.email,
        },
        process.env.JWT_SECRET,
        "1h"
      );

      existedUser.resetPasswordToken = resetPasswordToken;
      existedUser.save({ validateBeforeSave: false });

      try {
        const resetPasswordLink = `${
          req.host.includes("localhost") ? "http" : "https"
        }://${req.host}/auth/forget-password/${resetPasswordToken}`;
        await services.sendResetPassword(
          existedUser.email,
          resetPasswordLink
        );

      } catch (error) {
        console.log(error);

        return res.status(500).json({
          message: "Failed to send reset password link. Please try Again!",
          success: false,
        });
      }
    }
    return res.status(200).json({
      message: "Reset password link would be sent to your registered email.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error. Please try again!",
      success: false,
    });
  }
};

export const handleForgetPassword = async (req: Request, res: Response) => {
  try {
    const { body, params } = req;
    const { resetPasswordToken } = params;

    const loggedUser = await services.getUserByResetPasswordToken(
      resetPasswordToken
    );

    if (loggedUser) {
      try {
        const decodedToken = services.verifyToken(resetPasswordToken);

        if (decodedToken && decodedToken.email === loggedUser.email) {
          const { repeatPassword, newPassword } = body;

          if (!repeatPassword || !newPassword) {
            return res.status(400).json({
              message: "All fields are required",
              success: false,
            });
          }

          if (repeatPassword !== newPassword) {
            return res.status(400).json({
              message: "New password must be similar to Repeat password",
              success: false,
            });
          }

          if (newPassword.length < 8) {
            return res.status(400).json({
              message: "New password must be at least 8 characters long",
              success: false,
            });
          }

          if (!newPassword.match(/\d/)) {
            return res.status(400).json({
              message: "New password must contain a number",
              success: false,
            });
          }

          if (!newPassword.match(/[a-z]/)) {
            return res.status(400).json({
              message: "New password must include a lowercase letter",
              success: false,
            });
          }

          if (!newPassword.match(/[A-Z]/)) {
            return res.status(400).json({
              message: "New password must include an uppercase letter",
              success: false,
            });
          }

          if (!newPassword.match(/[^\w\s]/)) {
            return res.status(400).json({
              message: "New password must include a special character",
              success: false,
            });
          }
          const hashedPassword = await services.hashPassword(newPassword);

          if (hashedPassword) {
            const updatedUser = await services.updatePassword(
              loggedUser._id.toString(),
              hashedPassword
            );
            if (updatedUser) {
              loggedUser.resetPasswordToken = "";
              loggedUser.save({ validateBeforeSave: false });
              return res.status(200).json({
                message: "Password reset successfully",
                success: true,
              });
            } else {
              return res.status(400).json({
                message: "Failed to reset password",
                success: false,
              });
            }
          }
        } else {
          return res.status(400).json({
            message: "Reset password link expired. Generate again",
            success: false,
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          message: "Reset password link expired. Generate again",
          success: false,
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid reset password link. Generate new",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Internal server error. Please try again!",
      success: false,
    });
  }
};
