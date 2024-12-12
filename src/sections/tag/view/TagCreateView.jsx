// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import TagCreateForm from '../TagCreateForm';

// ----------------------------------------------------------------------

export default function TagCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Membuat Tag Baru"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Daftar Tag',
            href: paths.dashboard.tag.list,
          },
          { name: 'Buat Tag Baru' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TagCreateForm />
    </Container>
  );
}
