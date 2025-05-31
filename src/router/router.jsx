import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import ProfileView from "../pages/ProfilePage/ProfileView";
import ProfileEdit from "../pages/ProfilePage/ProfileEdit";
import ProfilePassword from "../pages/ProfilePage/ProfilePassword";
import LoginRouter from "./loginRouter";
import TeacherRouter from "./TeacherRouter";
import CreateRoomPage from "../pages/CreateRoom/CreateRoom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        // Protected routes
        element: <LoginRouter />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "profile",
            children: [
              {
                index: true,
                element: <ProfileView />,
              },
              {
                path: "edit",
                element: <ProfileEdit />,
              },
              {
                path: "password",
                element: <ProfilePassword />,
              },
            ],
          },
          {
            // Protected Teacher routes
            element: <TeacherRouter />,
            children: [
              {
                path: "create-room",
                element: <CreateRoomPage />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  { path: "/home", element: <HomePage /> },
]);

export default router;
