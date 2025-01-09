// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SectionForm from '../SectionForm';

// ----------------------------------------------------------------------

export default function NewsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Buat unit kerja baru"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Daftar Unit Kerja',
            href: paths.dashboard.section.list,
          },
          { name: 'Unit Kerja Baru' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SectionForm />
    </Container>
  );
}
