// Import statements

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { _socials } from 'src/_mock';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Kemen from '../../../public/logo/kemen3.png';
import Grid from '@mui/system/Unstable_Grid/Grid';

import Overlay from '../../../public/assets/background/kemenkopoverlay.jpg' ;

const LINKS = [
  {
    headline: 'FILE SHARING',
    children: [
      { name: 'About us', href: paths.about },
      { name: 'Contact us', href: paths.contact },
      { name: 'FAQs', href: paths.faqs },
    ],
  },
  {
    headline: 'LEGAL',
    children: [
      { name: 'Terms and Condition', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  },
  {
    headline: 'CONTACT',
    children: [{ name: 'kemenkop@gmail.com', href: '#' }],
  },
];

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
        width: '100%',
        backgroundImage: `url(${Overlay})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Divider />

      <Container
        sx={{
          pt: 5,
          pb: 5,
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        <Box
          component="img"
          src={Kemen}
          alt="Kemenkop"
          sx={{
            width: { xs: 200, md: 300 }, // Lebar maksimum untuk responsivitas
            maxWidth: '100%', // Menjaga agar lebar tidak melebihi kontainer
            height: 'auto', // Agar proporsional
            objectFit: 'contain', // Menjaga gambar tetap dalam batas tanpa dipotong
            mx: { xs: 'auto', md: -1 }, // Memastikan logo terpusat di perangkat kecil
            mt: -16,
            mb: { xs: -8, md: -12 }, // Jarak bawah untuk responsivitas
          }}
        />

        <Grid
          container
          spacing={3}
          justifyContent={{
            xs: 'center',
            md: 'space-between',
          }}
        >
          <Grid
            xs={12}
            md={3}
            sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 3, md: 0 } }}
          >
            <Typography
              variant="body2"
              sx={{
                maxWidth: 270,
                mx: { xs: 'auto', md: 'unset' },
              }}
            >
              Berbagi file dengan cepat dan praktis, kapan saja!
            </Typography>

            <Stack
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
            </Stack>
          </Grid>

          <Grid xs={12} md={6}>
            <Stack
              spacing={5}
              direction={{ xs: 'column', md: 'row' }}
              alignItems={{ xs: 'center', md: 'flex-start' }}
            >
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  alignItems={{ xs: 'center', md: 'flex-start' }}
                  sx={{ width: 1 }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 5, textAlign: 'center' }}>
          Copyright © 2024. Hak Cipta Dilindungi. Kementerian Koperasi dan UKM
        </Typography>
      </Container>
    </Box>
  );

  return mainFooter;
}

