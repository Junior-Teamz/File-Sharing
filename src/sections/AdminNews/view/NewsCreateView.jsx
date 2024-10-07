// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import AdminNewsForm from '../AdminNewsForm';

// ----------------------------------------------------------------------

export default function NewsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Buat berita baru"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Daftar Berita',
            href: paths.dashboard.AdminNews.list,
          },
          { name: 'Berita Baru' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AdminNewsForm />
    </Container>
  );
}
