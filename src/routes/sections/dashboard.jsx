import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import { FIleManagerDetail } from 'src/sections/file-manager/view/file-manager-detail';

//Tag
import TagListView from 'src/sections/tag/view/TagListView';
import TagCreateView from 'src/sections/tag/view/TagCreateView';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
// const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
// const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
// const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));

// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
// const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));

// INSTANCE
const InstanceList = lazy(() => import('src/pages/dashboard/instance/list'));
const InstanceEdit = lazy(() => import('src/pages/dashboard/instance/edit'));
const InstanceCreate = lazy(() => import('src/pages/dashboard/instance/create'));

// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
import FolderDetail from 'src/sections/file-manager/FolderDetail';

//share with me
import ShareWithMe from 'src/pages/dashboard/sharewithme';
import FolderDetailShare from 'src/sections/sharewithme/FolderDetail';
import { FIleManagerDetaill } from 'src/sections/sharewithme/view/file-manager-detail';

import AdminEditView from 'src/sections/AdminNews/view/AdminEditView';

//Legal
const LegalListView = lazy(() => import('src/sections/legalbasis/view/LegalListView'));
const LegalCreateView = lazy(() => import('src/sections/legalbasis/view/LegalCreateView'));

//news admin
const AdminListNews = lazy(() => import('src/sections/AdminNews/view/AdminListNews'));
const NewsCreateView = lazy(() => import('src/sections/AdminNews/view/NewsCreateView'));
const TagNewsCreateView = lazy(() => import('src/sections/newsTag/view/TagNewsCreateView'));
const TagNewsListView = lazy(() => import('src/sections/newsTag/view/TagNewsListView'));
const ListHelmetFavorite = lazy(() => import('src/sections/favorite/ListHelmetFavorite'));
import { FIleManagerDetailFavorite } from 'src/sections/favorite/view/file-manager-detail';

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },

      {
        path: 'favorite',
        children: [
          { element: <ListHelmetFavorite />, index: true },
          { path: 'info/:id', element: <FIleManagerDetailFavorite /> },
        ],
      },
      // { path: 'file', element: <OverviewFilePage /> },
      {
        path: 'shared-with-me',
        children: [
          { element: <ShareWithMe />, index: true },
          { path: 'info/:id', element: <FIleManagerDetaill /> },
          { path: 'folder', element: <FolderDetailShare /> },
        ],
      },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          // { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'instance',
        children: [
          { element: <InstanceList />, index: true, path: 'list' },
          { path: 'create', element: <InstanceCreate /> },
          { path: 'edit', element: <InstanceEdit /> },
        ],
      },
      {
        path: 'tag',
        children: [
          { element: <TagListView />, index: true, path: 'list' },
          { path: 'create', element: <TagCreateView /> },
        ],
      },

      {
        path: 'NewsTag',
        children: [
          { element: <TagNewsListView />, index: true, path: 'list' },
          { path: 'create', element: <TagNewsCreateView /> },
        ],
      },

      {
        path: 'legal',
        children: [
          { element: <LegalListView />, index: true, path: 'list' },
          { path: 'create', element: <LegalCreateView /> },
          // { path: 'edit', element: <InstanceEdit /> },
        ],
      },

      {
        path: 'News',
        children: [
          { element: <AdminListNews />, index: true, path: 'list' },
          { path: 'edit/:id', element: <AdminEditView /> },
          { path: 'create', element: <NewsCreateView /> },
        ],
      },

      {
        path: 'file-manager',
        children: [
          { element: <FileManagerPage />, index: true },
          { path: 'info/:id', element: <FIleManagerDetail /> },
          { path: 'folder', element: <FolderDetail /> },
        ],
      },
    ],
  },
];
