// @mui
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// Import your background image
import Background from '../../../../public/assets/background/background.png';
//
import FaqsHero from '../faqs-hero';
import FaqsList from '../faqs-list';

// ----------------------------------------------------------------------

export default function FaqsView() {
  return (
    <>
      {/* Background Wrapper */}
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'primary.main',
          color: 'common.white',
          minHeight: '100vh',
        }}
      >
        <FaqsHero />

        {/* Shape Wrapper */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none', // Prevent interaction blocking
          }}
        >
          {/* Shape 1 */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '70px',
              left: '-80px',
              width: '110px',
              height: '100px',
              backgroundColor: '#8FAF3E',
              borderRadius: '300px',
              zIndex: 0,
            }}
          />

          {/* Shape 2 */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '200px',
              right: '-80px',
              width: '180px',
              height: '180px',
              backgroundColor: '#8FAF3E',
              borderRadius: '300px',
              zIndex: 0,
            }}
          />
        </Box>

        <Container
          sx={{
            pb: 10,
            pt: { xs: 10, md: 15 },
            position: 'relative',
            zIndex: 1, // Keep content above shapes
          }}
        >
          <Typography
            variant="h3"
            sx={{
              my: { xs: 5, md: 10 },
              textAlign: 'center',
            }}
          >
            Frequently asked questions
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-start' },
              justifyContent: 'space-between',
              gap: { xs: 3, md: 5 },
            }}
          >
            {/* FaqsList */}
            <Box sx={{ flex: 1 }}>
              <FaqsList />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
