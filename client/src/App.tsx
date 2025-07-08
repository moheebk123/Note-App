import { lazy, Suspense, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { NotFound, NotAllowed } from "./pages";
import { Loader, AlertBox } from "./components";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { authService } from "./utils";
import { userDataActions } from "./store";

// Import Pages Through Lazy Loading
const Home = lazy(() => import("./pages/home/Home.jsx"));
const Register = lazy(() => import("./pages/register/Register.jsx"));
const Login = lazy(() => import("./pages/login/Login.jsx"));

interface NoteType {
  title: string;
  description: string | "";
  createdBy: string;
}

interface UserType {
  _id: string;
  name: string;
  email: string;
  notes: Array<NoteType> | [];
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
}

interface StoreType {
  userData: UserType;
}

const LayoutHandler = () => {
  const { isAuthenticated } = useSelector((store: StoreType) => store.userData);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.href;
    const authPath = path.split("/")
    const hashPath =
      path[path.length - 1] === "#"
        ? true
        : false;

    if (hashPath) {
      navigate("/");
    }
    if (authPath[authPath.length - 1] === 'auth') {
      navigate("/auth/login")
    }
  }, [location, navigate]);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Normal Routes for All Visitors */}
        <Route path="/not-allowed" element={<NotAllowed />} />
        <Route path="*" element={<NotFound />} />

        {/* Protected Routes for Not Logged Users */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isUserAllowed={false}
            />
          }
        >
          <Route path={`/auth`}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Route>

        {/* Protected Routes for Logged Users */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isUserAllowed={true}
            />
          }
        >
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

const App = () => {
  const { isCheckingAuth } = useSelector((store: StoreType) => store.userData);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.checkAuth();
        if (response) {
          dispatch(userDataActions.updateUser(response.data));
        }
      } catch {
        dispatch(userDataActions.updateUser({}));
      }
    };
    checkAuth();
  }, [dispatch]);

  return isCheckingAuth ? (
    <Loader />
  ) : (
    <Router>
      <AlertBox />
      <LayoutHandler />
    </Router>
  );
};

export default App;
