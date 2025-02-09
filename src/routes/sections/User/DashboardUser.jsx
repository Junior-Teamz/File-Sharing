import { AuthGuard } from 'src/auth/guard';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { LoadingScreen } from 'src/components/loading-screen';
import UsersPage from './UsersPage';
import DashboardUserLayout from '../dashboarduser/Layout';
// import { FileManagerDetailUsers } from './FileDetail/FileManagerDetailUsers';
import AccountView from './DriveUser/user-account-view';
import ShareUserPage from './ShareUserPage';
import FavoritePage from './FavoritePage';
import { FileManagerDetailUsersFavorite } from './favoriteuser/FileDetail/FileManagerDetailUsers';
import { FileManagerDetailUsersShare } from './shareuser/FileDetail/FileManagerDetailUsers';
import { FileManagerDetailUsers } from './FIleDetail/FileManagerDetailUsers';


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
      {
        path: 'shared-with-me',
        children: [
          { element: <ShareUserPage />, index: 'true' },
          { path: 'folder/:id', element: <FileManagerDetailUsersShare /> }
        ],
      },
      { path: 'favorite', 
        children:[
          {element:<FavoritePage/>, index:'true'},
          { path: 'folder/:id', element: <FileManagerDetailUsersFavorite /> },
        ]
      },
    ],
  },
];
