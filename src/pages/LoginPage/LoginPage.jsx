import { Navigate } from "react-router-dom";
import LoginForm from "../../components/LoginForm/LoginForm/LoginForm";
import useAuthStore from "../../store/useAuthStore";

const LoginPage = () => {
  const { session } = useAuthStore();

  if (session) {
    return <Navigate to="/" />;
  }

  return <LoginForm />;
};

export default LoginPage;
