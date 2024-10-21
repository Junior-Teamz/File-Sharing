// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import AdminNewsEdit from '../AdminNewsEdit';

// ----------------------------------------------------------------------

export default function AdminEditView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit berita"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Daftar Berita',
            href: paths.dashboard.AdminNews.list,
          },
          { name: 'Edit berita' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AdminNewsEdit />
    </Container>
  );
}
