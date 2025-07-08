import { Navigate, Outlet } from "react-router-dom";
import propTypes from "prop-types";

interface ProtectedPropsType {
  isAuthenticated: boolean;
  isUserAllowed: boolean;
}

const ProtectedRoute = ({ isAuthenticated, isUserAllowed } : ProtectedPropsType) => {
  if (isAuthenticated) {
    return isUserAllowed ? <Outlet /> : <Navigate to="/not-allowed" />;
  } else {
    return isUserAllowed ? <Navigate to="/not-allowed" /> : <Outlet />;
  }
};

ProtectedRoute.propTypes = {
  isUserAllowed: propTypes.bool.isRequired,
  isAuthenticated: propTypes.bool.isRequired,
};

export default ProtectedRoute;
