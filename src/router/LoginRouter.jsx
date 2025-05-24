import { Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const LoginRouter = () => {
  const { session } = useAuthStore();

  return session ? <Outlet /> : <Navigate to="/login" />;
};

export default LoginRouter;
