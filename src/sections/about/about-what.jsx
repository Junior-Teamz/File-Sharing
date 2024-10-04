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

// ----------------------------------------------------------------------

export const SKILLS = [...Array(3)].map((_, index) => ({
  label: ['Development', 'Design', 'Marketing'][index],
  value: [20, 40, 60][index],
}));

// ----------------------------------------------------------------------

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
      }}
    >
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

        <Grid xs={12} md={6} lg={5}>
          <Stack
            spacing={1}
            display="inline-flex"
            direction="row"
            sx={{ color: 'common.white', mb: 4, mt: 4, }}
          >
            <TextAnimate text="Apa" variants={varFade().inUp} sx={{ color: 'primary.main' }} />
            <TextAnimate text="Itu" variants={varFade().inUp} sx={{ color: 'primary.main' }} />
            <TextAnimate
              text="File Sharing?"
              variants={varFade().inUp}
              sx={{ color: 'primary.main' }}
            />
          </Stack>

          <m.div variants={varFade().inUp}>
            <Typography>
              File sharing adalah platform yang memungkinkan pengguna berbagi dan mentransfer file
              antar perangkat atau pengguna melalui jaringan. Dengan aplikasi ini, file seperti
              dokumen, gambar, dan video dapat diakses dan dibagikan dengan mudah, mendukung
              kolaborasi jarak jauh
            </Typography>
          </m.div>

          {/* <Stack spacing={3} sx={{ my: 5 }}>
            {SKILLS.map((progress, index) => (
              <Box component={m.div} key={progress.label} variants={varFade().inRight}>
                <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ flexGrow: 1, textAlign: 'left' }}>
                    {progress.label}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {fPercent(progress.value)}
                  </Typography>
                </Stack>

                <LinearProgress
                  color={(index === 0 && 'primary') || (index === 1 && 'warning') || 'error'}
                  variant="determinate"
                  value={progress.value}
                />
              </Box>
            ))}
          </Stack> */}
          {/* 
          <m.div variants={varFade().inRight}>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            >
              Our Work
            </Button>
          </m.div> */}
        </Grid>
      </Grid>
    </Container>
    // </Box>
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
