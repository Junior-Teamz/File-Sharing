import { m } from 'framer-motion';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/system/Unstable_Grid/Grid';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fPercent } from 'src/utils/format-number';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { MotionViewport, varFade } from 'src/components/animate';

export default function AboutWhat() {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const isLight = theme.palette.mode === 'light';

  const shadow = `-40px 40px 80px ${alpha(
    isLight ? theme.palette.grey[500] : theme.palette.common.black,
    0.24
  )}`;

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
        textAlign: { xs: 'center', md: 'unset' },
        position: 'relative', // Ensure container relative to control shape positioning
      }}
    >
      <div // shape 1
        style={{
          position: 'absolute',
          bottom: '70px',
          left: '-80px',
          width: '110px',
          height: '100px',
          backgroundColor: '#8FAF3E',
          borderRadius: '300px 300px 300px 300px',
          zIndex: 0, // Behind text
        }}
      />

      <div // shape 2
        style={{
          position: 'absolute',
          bottom: '190px',
          right: '-80px',
          width: '180px',
          height: '180px',
          backgroundColor: '#8FAF3E',
          borderRadius: '300px 300px 300px 300px',
          zIndex: 0, // Behind text
        }}
      />

      <Grid container columnSpacing={{ md: 3 }} alignItems="flex-start">
        {mdUp && (
          <Grid container xs={12} md={6} lg={7} alignItems="center" sx={{ pr: { md: 7 } }}>
            <Grid xs={6}>
              <m.div variants={varFade().inUp}>
                <Image
                  alt="our office 2"
                  src="/assets/images/about/share2.jpeg"
                  ratio="1/1"
                  sx={{ borderRadius: 3, boxShadow: shadow }}
                />
              </m.div>
            </Grid>

            <Grid xs={6}>
              <m.div variants={varFade().inUp}>
                <Image
                  alt="our office 1"
                  src="/assets/images/about/share1.jpeg"
                  ratio="3/4"
                  sx={{ borderRadius: 3, boxShadow: shadow }}
                />
              </m.div>
            </Grid>
          </Grid>
        )}

        <Grid xs={12} md={6} lg={5} sx={{ zIndex: 1 }}>
          {' '}
          {/* Text content with higher z-index */}
          <Stack
            spacing={1}
            display="inline-flex"
            direction="row"
            sx={{ color: 'common.white', mb: 4, mt: 4 }}
          >
            <TextAnimate
              text="Apa"
              variants={varFade().inUp}
              sx={{ color: 'common.white', zIndex: 2 }}
            />
            <TextAnimate
              text="Itu"
              variants={varFade().inUp}
              sx={{ color: 'common.white', zIndex: 2 }}
            />
            <TextAnimate
              text="File Sharing?"
              variants={varFade().inUp}
              sx={{ color: 'common.white', zIndex: 2 }}
            />
          </Stack>
          <m.div variants={varFade().inUp}>
            <Typography variant='h6' sx={{ zIndex: 2, position: 'relative' }}>
              File sharing adalah platform yang memungkinkan pengguna berbagi dan mentransfer file
              antar perangkat atau pengguna melalui jaringan. Dengan aplikasi ini, file seperti
              dokumen, gambar, dan video dapat diakses dan dibagikan dengan mudah, mendukung
              kolaborasi jarak jauh
            </Typography>
          </m.div>
        </Grid>
      </Grid>
    </Container>
  );
}

function TextAnimate({ text, variants, sx, ...other }) {
  return (
    <Box
      component={m.div}
      sx={{
        typography: 'h3',
        overflow: 'hidden',
        display: 'inline-flex',
        zIndex: 2, // Ensure text is above the shape
        ...sx,
      }}
      {...other}
    >
      {text.split('').map((letter, index) => (
        <m.span key={index} variants={variants || varFade().inUp}>
          {letter}
        </m.span>
      ))}
    </Box>
  );
}
