import { Navigate, Outlet } from "react-router-dom";

interface ProtectedPropsType {
  isAuthenticated: boolean;
  isUserAllowed: boolean;
}

const ProtectedRoute = ({
  isAuthenticated,
  isUserAllowed,
}: ProtectedPropsType) => {
  if (isAuthenticated) {
    return isUserAllowed ? <Outlet /> : <Navigate to="/not-allowed" />;
  } else {
    return isUserAllowed ? <Navigate to="/auth/login" /> : <Outlet />;
  }
};

export default ProtectedRoute;
