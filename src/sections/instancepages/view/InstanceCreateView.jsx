// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import InstanceCreateForm from '../InstanceCreateForm';
// //
// import InstanceCreateForm from '../InstanceCreateForm';

// ----------------------------------------------------------------------

export default function InstanceCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Buat Instansi Baru"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Daftar Instansi',
            href: paths.dashboard.instance.list,
          },
          { name: 'Buat Instansi' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InstanceCreateForm />
    </Container>
  );
}
