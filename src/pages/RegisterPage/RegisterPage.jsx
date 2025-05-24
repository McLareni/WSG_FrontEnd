import RegisterForm from "../../components/RegistrationForm/RegisterForm/RegisterForm";
import useAuthStore from "../../store/useAuthStore";

const RegisterPage = () => {
  const { session } = useAuthStore();

  if (session) {
    return <Navigate to="/" />;
  }

  return (
    <div className="register-page">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
