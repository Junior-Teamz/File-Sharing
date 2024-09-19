// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// routes
import { paths } from 'src/routes/paths';
//
import PropTypes from 'prop-types';

// @mui
import Container from '@mui/material/Container';

export default function InstanceEditView() {
  const settings = useSettingsContext();
  
  return (
   <>
     <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'List User',
            href: paths.dashboard.instance.list,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* <UserNewEditForm currentUser={currentUser} /> */}
    </Container>
   </>
  )
}
