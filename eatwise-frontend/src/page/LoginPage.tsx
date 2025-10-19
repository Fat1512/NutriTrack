import { LoginForm } from "../feature/authentication";
import AuthLayout from "./AuthLayout";

const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
