import { AuthGuard } from 'src/auth/guard';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { LoadingScreen } from 'src/components/loading-screen';
import UsersPage from './UsersPage';
import DashboardUserLayout from '../dashboarduser/Layout';
import { element } from 'prop-types';
import { FileManagerDetailUsers } from './FIleDetail/FileManagerDetailUsers';
import AccountView from './DriveUser/user-account-view';
import ShareUserPage from './ShareUserPage';
import FavoritePage from './FavoritePage';

export const DashboardUser = [
  {
    path: 'dashboarduser',
    element: (
      <AuthGuard>
        <DashboardUserLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardUserLayout>
      </AuthGuard>
    ),
    children: [
      { element: <UsersPage />, index: true },
      { path: 'folder/:id', element: <FileManagerDetailUsers /> },
      { path: 'akun', element: <AccountView /> },
      { path: 'shared-with-me', element: <ShareUserPage /> },
      { path: 'favorite', element: <FavoritePage /> },
    ],
  },
];
