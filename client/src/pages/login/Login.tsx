import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { hide, show, signIn } from "../../assets";
import { alertActions, userDataActions } from "../../store";
import { useDispatch } from "react-redux";
import { authService } from "../../utils";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { Button, Logo } from "../../components";

type OtpType = "password" | "text";

type SignStateType = "getting-otp" | "verifying-otp";

const Login = () => {
  const [otpType, setOtpType] = useState<OtpType>("password");
  const [signInState, setSignInState] = useState<SignStateType>("getting-otp");
  const emailRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChangeOtpType = () => {
    setOtpType((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleResendOtp = async () => {
    try {
      const otpResponse = await authService.sendOtp();
      if (otpResponse.success) {
        alert(
          `Email service is temporarily not working. Use this OTP to complete registration: ${otpResponse.otp}`
        );
        dispatch(
          alertActions.showAlert({
            show: true,
            message: otpResponse.message,
            severity: "error",
          })
        );
        setSignInState("verifying-otp");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      dispatch(
        alertActions.showAlert({
          show: true,
          severity: "error",
          message: err.response?.data.message,
        })
      );
    }
    setTimeout(() => {
      dispatch(alertActions.showAlert({}));
    }, 5000);
  };

  const handleGetOtp = async (e: SyntheticEvent) => {
    e.preventDefault();
    const email = String(emailRef.current?.value);

    if (!email) {
      dispatch(
        alertActions.showAlert({
          show: true,
          severity: "error",
          message: "Email is required.",
        })
      );
      setTimeout(() => {
        dispatch(alertActions.showAlert({}));
      }, 5000);
      return;
    }
    try {
      const loginResponse = await authService.login({ email });
      if (loginResponse.success) {
        dispatch(
          alertActions.showAlert({
            show: true,
            message: loginResponse.message,
            severity: "success",
          })
        );
        const otpResponse = await authService.sendOtp();
        if (otpResponse.success) {
          alert(
            `Email service is temporarily not working. Use this OTP to complete registration: ${otpResponse.otp}`
          );
          dispatch(
            alertActions.showAlert({
              show: true,
              message: otpResponse.message,
              severity: "error",
            })
          );
          setSignInState("verifying-otp");
        }
      } else {
        dispatch(
          alertActions.showAlert({
            show: true,
            message: loginResponse.message,
            severity: "error",
          })
        );
      }
      setTimeout(() => {
        dispatch(alertActions.showAlert({}));
      }, 5000);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      dispatch(
        alertActions.showAlert({
          show: true,
          severity: "error",
          message: err.response?.data.message,
        })
      );
    }
    setTimeout(() => {
      dispatch(alertActions.showAlert({}));
    }, 5000);
  };

  const handleVerifyOtp = async (e: SyntheticEvent) => {
    e.preventDefault();
    const otp = String(otpRef.current?.value);

    if (!otp) {
      dispatch(
        alertActions.showAlert({
          show: true,
          severity: "error",
          message: "OTP is required.",
        })
      );
      setTimeout(() => {
        dispatch(alertActions.showAlert({}));
      }, 5000);
      return;
    }

    try {
      const response = await authService.verifyEmail({ verifyCode: otp });
      if (response.success) {
        dispatch(
          alertActions.showAlert({
            show: true,
            message: response.message,
            severity: "success",
          })
        );
        dispatch(userDataActions.updateUser(response.user));
        navigate("/");
      } else {
        dispatch(
          alertActions.showAlert({
            show: true,
            message: response.message,
            severity: "error",
          })
        );
      }
      setTimeout(() => {
        dispatch(alertActions.showAlert({}));
      }, 5000);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      dispatch(
        alertActions.showAlert({
          show: true,
          severity: "error",
          message: err.response?.data.message,
        })
      );
    }
    setTimeout(() => {
      dispatch(alertActions.showAlert({}));
    }, 5000);
  };

  return (
    <div className="lg:flex items-center w-full h-full max-h-screen relative">
      <section className="w-full lg:w-[500px] h-screen flex flex-col justify-center md:px-10">
        <div className="lg:w-fit lg:absolute lg:top-5 lg:left-5">
          <Logo showLogoText={true} />
        </div>
        <h1 className="text-center lg:text-left text-4xl font-bold mt-5 mb-3">
          Sign In
        </h1>
        <p className="text-gray-400 text-center lg:text-left font-semibold">
          Please login to continue to your account
        </p>
        <form
          onSubmit={signInState === "getting-otp" ? handleGetOtp : handleVerifyOtp}
          className="flex flex-col gap-5 mt-5"
        >
          <input
            type="email"
            ref={emailRef}
            placeholder="Email"
            className="border border-gray-200 shadow rounded-lg text-xl p-3 outline-0"
          />
          {signInState === "verifying-otp" ? (
            <div className="border border-gray-200 shadow rounded-md text-xl p-3 outline-0 flex gap-3 items-center">
              <input
                type={otpType}
                minLength={8}
                maxLength={8}
                ref={otpRef}
                placeholder="OTP"
                className="outline-0 grow"
              />
              <img
                className="h-6"
                src={otpType === "password" ? show : hide}
                alt={otpType === "password" ? "Show" : "Hide"}
                onClick={handleChangeOtpType}
              />
            </div>
          ) : (
            <></>
          )}
          <span className="text-blue-600 font-semibold underline underline-offset-2 cursor-pointer w-fit" onClick={handleResendOtp}>
            Resend OTP
          </span>
          <Button
            text={signInState === "getting-otp" ? "Get OTP" : "Sign in"}
            type="submit"
          />
        </form>
        <p className="text-gray-400 font-semibold text-center mt-8">
          Need an account?{" "}
          <Link
            to="/auth/register"
            className="text-blue-600 underline underline-offset-2 cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </section>
      <div className="hidden lg:grow lg:flex lg:justify-center lg:items-center lg:h-full">
        <img src={signIn} alt="Sign In" />
      </div>
    </div>
  );
};

export default Login;
