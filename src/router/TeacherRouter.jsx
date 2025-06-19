import { Outlet, Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const TeacherRouter = () => {
  const { user } = useAuthStore();

  return user.role === "teacher" ? <Outlet /> : <Navigate to="/" />;
};

export default TeacherRouter;
