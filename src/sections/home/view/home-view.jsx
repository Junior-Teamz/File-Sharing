import { useScroll } from 'framer-motion';
// @mui
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
// components
import ScrollProgress from 'src/components/scroll-progress';
//
import HomeHero from '../home-hero';
import HomeLookingFor from '../home-looking-for';
import HomeAdvertisement from '../home-advertisement';
import Informasi from '../informasi';
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
    imgUrl: '/assets/background/kemenkopoverlay.jpg',
  }),
  width: '100%',
  height: '100vh',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    position: 'fixed',
  },
}));

// const StyledPolygon = styled('div')(({ anchor = 'top', theme }) => ({
//   left: 0,
//   zIndex: 9,
//   height: 80,
//   width: '100%',
//   position: 'absolute',
//   clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
//   backgroundColor: theme.palette.background.default,
//   display: 'block',
//   lineHeight: 0,
//   ...(anchor === 'top' && {
//     top: -1,
//     transform: 'scale(-1, -1)',
//   }),
//   ...(anchor === 'bottom' && {
//     bottom: -1,
//     backgroundColor: theme.palette.grey[900],
//   }),
// }));

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <Informasi />
      </Box>

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
        }}
      >
        <HomeLookingFor />
      </Box>
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(120deg, #d4fc79 0%, #43e97b 100%)',
        }}
      >
        <HomeAdvertisement />
      </Box>
    </>
  );
}
