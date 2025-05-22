import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import HomePage from "../pages/HomePage/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import ProfileView from "../pages/ProfilePage/ProfileView"; 
import ProfileEdit from "../pages/ProfilePage/ProfileEdit";
import ProfilePassword from "../pages/ProfilePage/ProfilePassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
            ),
          },
          {
            path: "edit",
            element: (
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            ),
          },
          {
            path: "password",
            element: (
              <ProtectedRoute>
                <ProfilePassword />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
