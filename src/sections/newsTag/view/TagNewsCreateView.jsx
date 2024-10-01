// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import TagNewsCreateForm from '../TagNewsCreateForm';


// ----------------------------------------------------------------------

export default function TagNewsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new tag news"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Tag List',
            href: paths.dashboard.TagNews.list,
          },
          { name: 'Tag Create' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TagNewsCreateForm />
    </Container>
  );
}
