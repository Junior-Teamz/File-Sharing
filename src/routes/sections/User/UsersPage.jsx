import { Grid } from '@mui/material';
import { Container } from '@mui/system';
import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import SeoIllustration from 'src/assets/illustrations/seo-illustration';
import { AuthContext } from 'src/auth/context/jwt';
import { useSettingsContext } from 'src/components/settings';
import { HeaderSimple } from 'src/layouts/_common';
import Header from 'src/layouts/dashboard/header';
import AppWelcome from 'src/sections/overview/app/app-welcome';

export default function UsersPage() {
  const { user } = useContext(AuthContext);
  const settings = useSettingsContext();
  return (
    <>
      <Helmet>
        <title>Dashboard Users</title>
      </Helmet>

    <Header/>

      {/* <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <AppWelcome title={`Welcome back 👋 ${user?.name}`} img={<SeoIllustration />} />
        </Grid>
      </Container> */}
    </>
  );
}
