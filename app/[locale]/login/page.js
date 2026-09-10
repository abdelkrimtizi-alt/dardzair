import Header from "../../../components/Header";
import AuthForm from "../../../components/AuthForm";

export default function LoginPage() {
  return (
    <main>
      <Header />
      <AuthForm mode="login" />
    </main>
  );
}
