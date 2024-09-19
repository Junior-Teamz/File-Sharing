import { m } from 'framer-motion';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/system/Unstable_Grid/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';

// components
import Image from 'src/components/image';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function InformationAndAnnouncements() {
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
      {/* Grid untuk Informasi */}
      <Grid container columnSpacing={{ md: 3 }} sx={{ mb: 5 }}>
        <Grid xs={12} md={6} lg={5}>
          <m.div variants={varFade().inUp}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              Informasi
            </Typography>
          </m.div>

          <m.div variants={varFade().inUp}>
            <Typography
              sx={{
                color: theme.palette.mode === 'light' ? 'text.secondary' : 'common.white',
                textAlign: 'justify',
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
              }}
            >
              Aplikasi file sharing adalah solusi digital yang memungkinkan pengguna untuk berbagi,
              mengakses, dan mengelola berbagai jenis file secara online. Dengan aplikasi ini,
              pengguna dapat mengirim dan menerima file seperti dokumen, gambar, video, dan lainnya
              dengan cepat dan aman, baik untuk keperluan pribadi maupun profesional.
            </Typography>
          </m.div>
        </Grid>
      </Grid>

      {/* Grid untuk Pengumuman */}
      <Grid container spacing={4}>
        <Grid xs={12} md={6}>
          <m.div variants={varFade().inUp}>
            <Card
              sx={{
                boxShadow: shadow,
                borderRadius: 2,
                bgcolor: isLight ? 'background.paper' : 'grey.800',
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Pengumuman 1
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Kami telah menambahkan fitur baru untuk meningkatkan pengalaman pengguna Anda.
                </Typography>
                <Button variant="contained" color="primary">
                  Selengkapnya
                </Button>
              </CardContent>
            </Card>
          </m.div>
        </Grid>

        <Grid xs={12} md={6}>
          <m.div variants={varFade().inUp}>
            <Card
              sx={{
                boxShadow: shadow,
                borderRadius: 2,
                bgcolor: isLight ? 'background.paper' : 'grey.800',
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Pengumuman 2
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Kami mengundang Anda untuk berpartisipasi dalam webinar kami pada akhir bulan ini.
                </Typography>
                <Button variant="contained" color="primary">
                  Daftar Sekarang
                </Button>
              </CardContent>
            </Card>
          </m.div>
        </Grid>
      </Grid>
    </Container>
  );
}
