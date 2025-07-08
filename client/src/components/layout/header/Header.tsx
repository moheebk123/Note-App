import { useDispatch } from "react-redux";
import { alertActions } from "../../../store/alert.js";
import authService from "../../../utils/auth.js";
import { Logo } from "../../index.js";
import { userDataActions } from "../../../store/userData.js";
import type { AxiosError } from "axios";

const Header = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      if (response) {
        dispatch(
          alertActions.showAlert({
            show: true,
            severity: response.success ? "success" : "error",
            message: response.message,
          })
        );

        if (response.success) {
          dispatch(userDataActions.updateUser(undefined));
        }
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

  return (
    <header className="flex gap-3 items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Logo showLogoText={false} />
        <span className="text-2xl font-semibold">Dashboard</span>
      </div>
      <span
        onClick={handleLogout}
        className="text-xl font-semibold text-blue-600 underline underline-offset-2 cursor-pointer"
      >
        Sign Out
      </span>
    </header>
  );
};

export default Header;
