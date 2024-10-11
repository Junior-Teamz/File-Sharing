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
      {/* Background wrapper */}
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(120deg, #d4fc79 0%, #43e97b 100%)',
        }}
      >
        <FaqsHero />

        <Container
          sx={{
            pb: 10,
            pt: { xs: 10, md: 15 },
            position: 'relative',
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
          bottom: '550px',
          right: '-80px',
          width: '180px',
          height: '180px',
          backgroundColor: '#8FAF3E',
          borderRadius: '300px 300px 300px 300px',
          zIndex: 0, // Behind text
        }}
      />

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
