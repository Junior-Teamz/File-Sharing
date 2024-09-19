import { Helmet } from 'react-helmet-async';
// sections
import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Login To File Sharing KemenkopUKM</title>
      </Helmet>

      <JwtLoginView />
    </>
  );
}
