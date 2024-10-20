import { Helmet } from 'react-helmet-async';
// sections
import { ClassicForgotPasswordView } from 'src/sections/auth-demo/classic';

// ----------------------------------------------------------------------

export default function ClassicForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Auth: Forgot Password</title>
      </Helmet>

      <ClassicForgotPasswordView />
    </>
  );
}
