// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LegalCreateForm from '../LegalCreateForm';

// ----------------------------------------------------------------------

export default function LegalCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Buat dasar hukum baru"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Daftar dasar hukum',
            href: paths.dashboard.legal.list,
          },
          { name: 'Buat dasar hukum baru' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LegalCreateForm />
    </Container>
  );
}
