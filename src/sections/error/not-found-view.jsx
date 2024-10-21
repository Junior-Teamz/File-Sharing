import { m } from 'framer-motion';
// @mui
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// layouts
import CompactLayout from 'src/layouts/compact';
// routes
import { RouterLink } from 'src/routes/components';
// components
import { MotionContainer, varBounce } from 'src/components/animate';
// assets
import { PageNotFoundIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export default function NotFoundView() {
  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Halaman Tidak di temukan
          </Typography>
        </m.div>

        {/* <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin Anda salah mengetik
            URL? Pastikan untuk memeriksa ejaan Anda.
          </Typography>
        </m.div> */}

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>

        <Button component={RouterLink} href="/" size="large" variant="contained">
          Kembali Ke Home
        </Button>
      </MotionContainer>
    </CompactLayout>
  );
}
