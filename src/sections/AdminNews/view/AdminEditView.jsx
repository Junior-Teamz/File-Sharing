import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import AdminNewsEdit from '../AdminNewsEdit';
import { useParams } from 'react-router-dom';

export default function AdminEditView() {
  const settings = useSettingsContext();
  const { id } = useParams(); // Mengambil ID dari URL

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit berita"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Daftar Berita', href: paths.dashboard.AdminNews.list },
          { name: 'Edit berita' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* Oper ID ke AdminNewsEdit */}
      <AdminNewsEdit newsId={id} />
    </Container>
  );
}
