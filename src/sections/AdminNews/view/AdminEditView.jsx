// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import AdminNewsEdit from '../AdminNewsEdit';
// react-router
import { useParams } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function AdminEditView() {
  const settings = useSettingsContext();
  // Mengambil ID dari URL
  const { id } = useParams();

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

      {/* Mengoper ID ke komponen AdminNewsEdit jika perlu */}
      <AdminNewsEdit newsId={id} />
    </Container>
  );
}
