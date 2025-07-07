import {
  RESET_PASSWORD_EMAIL_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "../templates/email.template.js";
import { transporter } from "../utils/index.utils.js";

export const sendVerificationCode = async (email: StringPayload, verificationCode: StringPayload) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "URL Shortener, Email Verification",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationCode
      ),
    };
    const success = await transporter.sendMail(mailOptions);
    return success;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const sendResetPassword = async (email: StringPayload, resetPasswordLink: StringPayload) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "URL Shortener, Reset Password",
      html: RESET_PASSWORD_EMAIL_TEMPLATE.replace(
        "{resetPasswordLink}",
        resetPasswordLink
      ),
    };
    const success = await transporter.sendMail(mailOptions);
    return success;
  } catch (error) {
    console.log(error);
    return false;
  }
};
