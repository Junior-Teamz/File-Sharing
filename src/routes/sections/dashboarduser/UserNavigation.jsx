import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import Groups2Icon from '@mui/icons-material/Groups2';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  blog: icon('ic_blog'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  folder: icon('ic_folder'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  drive: <AddToDriveIcon />,
  share: <Groups2Icon/>
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [
          {
            title: t('My Drive'),
            path: paths.dashboarduser.root,
            icon: ICONS.drive,
          },
        //   {
        //     title: t('file_manager'),
        //     path: paths.dashboard.fileManager,
        //     icon: ICONS.folder,
        //   },
        //   {
        //     title: t('analytics'),
        //     path: paths.dashboard.general.analytics,
        //     icon: ICONS.analytics,
        //   },
        //   {
        //     title: t('file'),
        //     path: paths.dashboard.general.file,
        //     icon: ICONS.file,
        //   },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // USER
          {
            title: t('shared with me'),
            path: paths.dashboard.user.root,
            icon: ICONS.share,
            children: [
            //   { title: t('profile'), path: paths.dashboard.user.root },
            //   { title: t('cards'), path: paths.dashboard.user.cards },
            //   { title: t('list user'), path: paths.dashboard.user.list },
            //   { title: t('create user'), path: paths.dashboard.user.new },
            //   { title: t('edit'), path: paths.dashboard.user.demo.edit },
            //   { title: t('account'), path: paths.dashboard.user.account },
            ],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
