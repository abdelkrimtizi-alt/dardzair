import Header from "../../../components/Header";
import AuthForm from "../../../components/AuthForm";

export default function SignupPage() {
  return (
    <main>
      <Header />
      <AuthForm mode="signup" />
    </main>
  );
}
