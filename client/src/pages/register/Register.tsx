import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { hide, show, signUp } from "../../assets";
import { alertActions, userDataActions } from "../../store";
import { useDispatch } from "react-redux";
import { authService } from "../../utils";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { Button, Logo } from "../../components";

type OtpType = "password" | "text";

type SignStateType = "getting-otp" | "verifying-otp";

const Register = () => {
  const [otpType, setOtpType] = useState<OtpType>("password");
  const [signUpState, setSignUpState] = useState<SignStateType>("getting-otp");
  const nameRef = useRef<HTMLInputElement>(null);
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

  const handleGetOtp = async (e: SyntheticEvent) => {
    e.preventDefault();
    const name = String(nameRef.current?.value);
    const email = String(emailRef.current?.value);

    if (!name || !email) {
      dispatch(
        alertActions.showAlert({
          show: true,
          severity: "error",
          message: "All fields are required.",
        })
      );
      setTimeout(() => {
        dispatch(alertActions.showAlert({}));
      }, 5000);
      return;
    }
    try {
      const registerResponse = await authService.register({ email, name });
      if (registerResponse.success) {
        dispatch(
          alertActions.showAlert({
            show: true,
            message: registerResponse.message,
            severity: registerResponse.success ? "success" : "error",
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
          setSignUpState("verifying-otp");
        }
      } else {
        dispatch(
          alertActions.showAlert({
            show: true,
            message: registerResponse.message,
            severity: registerResponse.success ? "success" : "error",
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
            severity: response.success ? "success" : "error",
          })
        );
        dispatch(userDataActions.updateUser(response.user));
        navigate("/");
      } else {
        dispatch(
          alertActions.showAlert({
            show: true,
            message: response.message,
            severity: response.success ? "success" : "error",
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
          Sign up
        </h1>
        <p className="text-gray-400 text-center lg:text-left font-semibold">
          Sign up to enjoy the feature of HD
        </p>
        <form
          onSubmit={
            signUpState === "getting-otp" ? handleGetOtp : handleVerifyOtp
          }
          className="flex flex-col gap-5 mt-5"
        >
          <input
            type="text"
            ref={nameRef}
            placeholder="Name"
            required
            className="border border-gray-200 shadow rounded-lg text-xl p-3 outline-0"
          />
          <input
            type="email"
            ref={emailRef}
            placeholder="Email"
            className="border border-gray-200 shadow rounded-lg text-xl p-3 outline-0"
          />
          {signUpState === "verifying-otp" ? (
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
          <Button
            text={signUpState === "getting-otp" ? "Get OTP" : "Sign up"}
            type="submit"
          />
        </form>
        <p className="text-gray-400 font-semibold text-center mt-8">
          Need an account?{" "}
          <Link
            to="/auth/login"
            className="text-blue-600 underline underline-offset-2 cursor-pointer"
          >
            Sign in
          </Link>
        </p>
      </section>
      <div className="hidden lg:grow lg:flex lg:justify-center lg:items-center lg:h-full">
        <img src={signUp} alt="Sign Up" />
      </div>
    </div>
  );
};

export default Register;
