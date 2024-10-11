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
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));

// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
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

//Legal
const LegalListView = lazy(() => import('src/sections/legalbasis/view/LegalListView'));
const LegalCreateView = lazy(() => import('src/sections/legalbasis/view/LegalCreateView'));

//news admin
const AdminListNews = lazy(() => import('src/sections/AdminNews/view/AdminListNews'));
const NewsCreateView = lazy(() => import('src/sections/AdminNews/view/NewsCreateView'));
const TagNewsCreateView = lazy(() => import('src/sections/newsTag/view/TagNewsCreateView'));
const TagNewsListView = lazy(() => import('src/sections/newsTag/view/TagNewsListView'));

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
      // { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      // { path: 'banking', element: <OverviewBankingPage /> },
      // { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
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
          // { path: 'edit', element: <InstanceEdit /> },
        ],
      },

      {
        path: 'NewsTag',
        children: [
          { element: <TagNewsListView />, index: true, path: 'list' },
          { path: 'create', element: <TagNewsCreateView /> },
          // { path: 'edit', element: <InstanceEdit /> },
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
          { path: 'create', element: <NewsCreateView /> },
          // { path: 'edit', element: <InstanceEdit /> },
        ],
      },
      // {
      //   path: 'product',
      //   children: [
      //     { element: <ProductListPage />, index: true },
      //     { path: 'list', element: <ProductListPage /> },
      //     { path: ':id', element: <ProductDetailsPage /> },
      //     { path: 'new', element: <ProductCreatePage /> },
      //     { path: ':id/edit', element: <ProductEditPage /> },
      //   ],
      // },
      // {
      //   path: 'order',
      //   children: [
      //     { element: <OrderListPage />, index: true },
      //     { path: 'list', element: <OrderListPage /> },
      //     { path: ':id', element: <OrderDetailsPage /> },
      //   ],
      // },
      // {
      //   path: 'invoice',
      //   children: [
      //     { element: <InvoiceListPage />, index: true },
      //     { path: 'list', element: <InvoiceListPage /> },
      //     { path: ':id', element: <InvoiceDetailsPage /> },
      //     { path: ':id/edit', element: <InvoiceEditPage /> },
      //     { path: 'new', element: <InvoiceCreatePage /> },
      //   ],
      // },
      // {
      //   path: 'post',
      //   children: [
      //     { element: <BlogPostsPage />, index: true },
      //     { path: 'list', element: <BlogPostsPage /> },
      //     { path: ':title', element: <BlogPostPage /> },
      //     { path: ':title/edit', element: <BlogEditPostPage /> },
      //     { path: 'new', element: <BlogNewPostPage /> },
      //   ],
      // },
      // {
      //   path: 'job',
      //   children: [
      //     { element: <JobListPage />, index: true },
      //     { path: 'list', element: <JobListPage /> },
      //     { path: ':id', element: <JobDetailsPage /> },
      //     { path: 'new', element: <JobCreatePage /> },
      //     { path: ':id/edit', element: <JobEditPage /> },
      //   ],
      // },
      // {
      //   path: 'tour',
      //   children: [
      //
      //     { path: 'list', element: <TourListPage /> },
      //     { path: ':id', element: <TourDetailsPage /> },
      //     { path: 'new', element: <TourCreatePage /> },
      //     { path: ':id/edit', element: <TourEditPage /> },
      //   ],
      // },
      {
        path: 'file-manager',
        children: [
          { element: <FileManagerPage />, index: true },
          { path: 'info/:id', element: <FIleManagerDetail /> },
          // { path: 'infosubfolder/:id', element: <FIleManagerDetail /> },
        ],
      },
      // { path: 'mail', element: <MailPage /> },
      // { path: 'chat', element: <ChatPage /> },
      // { path: 'calendar', element: <CalendarPage /> },
      // { path: 'kanban', element: <KanbanPage /> },
      // { path: 'permission', element: <PermissionDeniedPage /> },
      // { path: 'blank', element: <BlankPage /> },
    ],
  },
];
