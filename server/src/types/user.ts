export interface UserType {
  _id: string;
  name: string;
  email: string;
  password: string;
  refreshToken: string;
  resetPasswordToken: string;
  verificationCode: string;
  isVerified: boolean;
  notes: Array<string | object>;
  oauthUser: string | object;
}
