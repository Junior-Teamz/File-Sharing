import SeoIllustration from 'src/assets/illustrations/seo-illustration';
import { AuthContext } from 'src/auth/context/jwt';
import { useSettingsContext } from 'src/components/settings';
import AppWelcome from 'src/sections/overview/app/app-welcome';
import { Grid } from '@mui/material';
import { Container } from '@mui/system';
import React, { useContext } from 'react';
import FileManagerView from './DriveUser/view/FileManagerView';

export default function DriveUser() {
  const { user } = useContext(AuthContext);
  const settings = useSettingsContext();

  return (
    <Container sx={{mt: 5, }} maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={14}>
          <AppWelcome title={`Selamat datang  ${user?.name} 👋`} img={<SeoIllustration />} />
        </Grid>

        <FileManagerView/>
      </Grid>
    </Container>
  );
}
