import { AuthGuard } from 'src/auth/guard';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { LoadingScreen } from 'src/components/loading-screen';
import UsersPage from './UsersPage';
import DashboardUserLayout from '../dashboarduser/Layout';
import { element } from 'prop-types';
<<<<<<< HEAD
import FileManagerDetailUsers from './FIleDetail/FileManagerDetailUsers';
=======
import { FileManagerDetailUsers } from './FileDetail/FileManagerDetailUsers';
>>>>>>> eae0407082a00742c5b25e7538271b6e0b960768

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
    ],
  },
];