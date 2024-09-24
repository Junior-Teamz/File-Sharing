import { Helmet } from 'react-helmet-async';
import DriveUser from './DriveUser';

export default function UsersPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard Users</title>
      </Helmet>

      <DriveUser/>
    </>
  );
}
