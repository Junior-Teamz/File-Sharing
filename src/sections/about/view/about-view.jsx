import AboutHero from '../about-hero';
import AboutWhat from '../about-what';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function AboutView() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(353deg, #173d31, #295b37, #3a7c3b, #4b9e3e)',
      }}
    >
      <AboutHero />
      <AboutWhat />
    </Box>
  );
}
