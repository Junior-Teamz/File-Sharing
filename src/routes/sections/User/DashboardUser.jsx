import { AuthGuard } from 'src/auth/guard';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { LoadingScreen } from 'src/components/loading-screen';
import UsersPage from './UsersPage';
import DashboardUserLayout from '../dashboarduser/Layout';

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
      { element: <UsersPage />, index: true }
    ],
  },
];
