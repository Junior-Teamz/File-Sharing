import AboutHero from '../about-hero';
import AboutWhat from '../about-what';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function AboutView() {
  return (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
        background: 'linear-gradient(120deg, #43e97b  0%, #96e6a1 100%,  #d4fc79 0%)',
      }}
    >
      <AboutHero />
      <AboutWhat />
    </Box>
  );
}
