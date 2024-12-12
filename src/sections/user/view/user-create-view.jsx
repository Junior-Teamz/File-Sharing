// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import UserNewEditForm from '../user-new-edit-form';
import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from 'src/theme/css';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserCreateView() {
  const settings = useSettingsContext();
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          ...bgGradient({
            color: alpha(
              theme.palette.background.paper,
              theme.palette.mode === 'light' ? 0.8 : 0.8
            ),
            imgUrl: '/assets/background/overlay_3.jpg',
          }),
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          position: 'absolute',
          filter: 'blur(20px)',
          WebkitFilter: 'blur(20px)',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      />
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Membuat user baru "
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Daftar User',
              href: paths.dashboard.user.list,
            },
            { name: 'Buat User' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <UserNewEditForm />
      </Container>
    </Box>
  );
}
