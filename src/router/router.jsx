import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import ProfileView from "../pages/ProfilePage/ProfileView";
import ProfileEdit from "../pages/ProfilePage/ProfileEdit";
import ProfilePassword from "../pages/ProfilePage/ProfilePassword";
import LoginRouter from "./LoginRouter";
import TeacherRouter from "./TeacherRouter";
import CreateRoomPage from "../pages/CreateRoom/CreateRoom";
import AddNotePage from "../pages/AddNotePage/AddNotePage";
import MeasurementsPage from "../pages/MeasurementsPage/MeasuremensPage";
import NotesPage from "../pages/NotePage/NotePage";
import Reservation from "../pages/Resetvation/Reservation";
import MyReservationPage from "../pages/MyReservationPage/MyReservationPage";

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
          { path: "notes", element: <NotesPage /> },
          { path: "measurements", element: <MeasurementsPage /> },
          {
            path: "add-note/:roomId/:reservationId",
            element: <AddNotePage />,
          },
          {
            path: "reservation/:roomId",
            element: <Reservation />,
          },
          {
            path: "my-reservations",
            element: <MyReservationPage />,
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
]);

export default router;
