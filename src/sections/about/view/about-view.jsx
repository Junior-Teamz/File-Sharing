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
        backgroundColor: 'primary.main',
        color: 'common.white',
      }}
    >
      <AboutHero />
      <AboutWhat />
    </Box>
  );
}
