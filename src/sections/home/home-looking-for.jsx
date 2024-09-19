import { useState } from 'react';
import { m } from 'framer-motion';
// @mui
import { Stack, Container, Typography, Grid, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeLookingFor() {
  const [pdfToShow, setPdfToShow] = useState(null);

  const handleCardClick = (label) => {
    const pdfMap = {
      'Permen PANRB No. 43 Tahun 2022': 'Spppd.pdf',
      'Permen KOPUKM No. 03 Tahun 2023': 'kopukm.pdf',
    };
    setPdfToShow(pdfMap[label] || null);
  };

  const handleClose = () => setPdfToShow(null);

  const cards = [
    { icon: <PictureAsPdfIcon fontSize="large" />, label: 'Permen PANRB No. 43 Tahun 2022' },
    { icon: <PictureAsPdfIcon fontSize="large" />, label: 'Permen KOPUKM No. 03 Tahun 2023' },
  ];

  return (
    <Container component={MotionViewport} sx={{ py: { xs: 10, md: 15 } }}>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100px',
          height: '80px',
          backgroundColor: '#8FAF3E', // Hijau Avocado
          borderRadius: '0 300px 0 0',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-50px', // Adjust position to make it more visible
          right: '-50px',
          width: '200px',
          height: '200px',
          backgroundColor: '#e2e8f0', // Abu-abu
          borderRadius: '0 0 0 300px',
          zIndex: 1,
        }}
      />
      <Grid container spacing={4}>
        {/* Title: Dasar Hukum */}
        <Grid item xs={12}>
          <m.div variants={varFade().inUp}>
            <Typography sx={{ color: '#6EC207' }} variant="h4" align="center" gutterBottom>
              Dasar Hukum
            </Typography>
          </m.div>
        </Grid>

        {/* PDF Cards */}
        <Grid container item xs={12} spacing={2}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={6} key={card.label}>
              <m.div variants={varFade().inUp}>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                  onClick={() => handleCardClick(card.label)}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: 'primary.main',
                    color: 'common.white',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease-in-out, backgroundColor 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  {card.icon}
                  <Typography variant="h6">{card.label}</Typography>
                </Stack>
              </m.div>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* PDF Preview Modal */}
      {pdfToShow && (
        <Grid item xs={12}>
          <div style={{ position: 'relative', marginTop: '16px' }}>
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <iframe
              src={`/assets/pdf/${pdfToShow}`}
              width="100%"
              height="600px"
              style={{ border: 'none' }}
              title="PDF Preview"
            />
          </div>
        </Grid>
      )}
    </Container>
  );
}
