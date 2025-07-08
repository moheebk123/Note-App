import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

interface RegisterType {
  name: string,
  email: string,
}

interface LoginType {
  email: string,
}

interface VerifyEmailType {
  verifyCode: string,
}

class AuthService {
  async register(registerData: RegisterType) {
    const res = await axios.post(`${API_URL}/auth/register`, registerData);
    return res.data;
  }

  async login(loginData: LoginType) {
    const res = await axios.post(`${API_URL}/auth/login`, loginData);
    return res.data;
  }

  async logout() {
    const res = await axios.post(`${API_URL}/auth/logout`);
    return res.data;
  }

  async sendOtp() {
    const res = await axios.get(`${API_URL}/auth/send-otp`);
    return res.data;
  }

  async verifyEmail(verifyEmailData: VerifyEmailType) {
    const res = await axios.post(
      `${API_URL}/auth/verify-email`,
      verifyEmailData
    );
    return res.data;
  }

  async checkAuth() {
    const res = await axios.get(`${API_URL}/auth/check-auth`);
    return res.data;
  }

  async googleLogin() {
    const res = await axios.get(`${API_URL}/oauth/google/redirect`);
    return res.data;
  }
}

const authService = new AuthService();
export default authService;
