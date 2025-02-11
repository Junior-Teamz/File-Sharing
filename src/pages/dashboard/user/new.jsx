import { Helmet } from 'react-helmet-async';
// sections
import { UserCreateView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Buat User Baru</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
