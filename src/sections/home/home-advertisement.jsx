import { m } from 'framer-motion';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import { alpha } from '@mui/material/styles';
// import IconButton from '@mui/material/IconButton';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Iconify from 'src/components/iconify';
import { MotionViewport, varFade } from 'src/components/animate';
// //mock
// import { _socials } from 'src/_mock';

// ----------------------------------------------------------------------

export default function HomeAdvertisement() {
  const theme = useTheme();

  const renderDescription = (
    <Box
      sx={{
        textAlign: {
          xs: 'center',
          md: 'left',
        },
        flex: 1, // Memberikan ruang lebih kecil untuk deskripsi
      
      }}
    >
      <Box
        component={m.div}
        variants={varFade().inDown}
        sx={{ color: 'common.white', mb: 5, typography: 'h2' }}
      >
        Hubungi Kami
      </Box>

      <Typography variant="body1" sx={{ color: 'common.white', mb: 3 }}>
        Jl. H. R. Rasuna Said No.3-4, RT.6/RW.7, Kuningan, Karet Kuningan, Kecamatan Setiabudi, Kota
        Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12940
      </Typography>

      {/* <Stack
        direction="row"
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        sx={{
          mt: 3,
          mb: { xs: 5, md: 0 },
        }}
      >
        {_socials.map((social) => (
          <IconButton
            key={social.name}
            sx={{
              '&:hover': {
                bgcolor: alpha(social.color, 0.08),
              },
            }}
          >
            <Iconify color={social.color} icon={social.icon} />
          </IconButton>
        ))}
      </Stack> */}
    </Box>
  );

  const renderEmbedLocation = (
    <Stack
      component={m.div}
      variants={varFade().inUp}
      alignItems="center"
      sx={{ flex: 1 }} // Memberikan ruang lebih besar untuk peta
    >
      <Box
        component="iframe"
        sx={{
          border: 0,
          width: '100%',
          height: { xs: 240, md: 300 },
          borderRadius: 2,
          maxWidth: 500, // Lebar maksimum peta ditingkatkan
          boxShadow: theme.shadows[3],
        }}
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31730.957091197866!2d106.818685!3d-6.214887!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3f79a35f997%3A0x3877c5bc98573b28!2sDeputi%20Bidang%20Perkoperasian%20Kementerian%20Koperasi%20dan%20UKM!5e0!3m2!1sen!2sid!4v1724647358074!5m2!1sen!2sid"
        allowFullScreen=""
        loading="lazy"
      />
    </Stack>
  );

  return (
    <Container sx={{  mt: 10, mb:  5,}} component={MotionViewport}>
      <Stack
        alignItems="center"
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        sx={{
          ...bgGradient({
            direction: '135deg',
            startColor: theme.palette.primary.main,
            endColor: theme.palette.primary.dark,
          }),
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: theme.shadows[5],
          padding: 3,
        }}
      >
        {renderEmbedLocation}

        {renderDescription}
      </Stack>
    </Container>
  );
}
