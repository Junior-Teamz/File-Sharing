import { useState } from 'react';
import { m } from 'framer-motion';
// @mui
import { Stack, Container, Typography, Grid, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { MotionViewport, varFade } from 'src/components/animate';
import { useFetchLegall } from './view/fetcLegalbasis/useFetchLegal';

// ----------------------------------------------------------------------

export default function HomeLookingFor() {
  const [pdfToShow, setPdfToShow] = useState(null);
  const { data: legalBasisData = [], error, isLoading } = useFetchLegall();

  const handleCardClick = (id) => {
    const selectedBasis = legalBasisData.find((item) => item.id === id);
    setPdfToShow(selectedBasis ? selectedBasis.file_url : null);
  };


  const handleClose = () => setPdfToShow(null);

  return (
    <Container component={MotionViewport} sx={{ py: { xs: 10, md: 15 }, position: 'relative' }}>
      {/* Decorative Elements */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100px', height: '80px', backgroundColor: '#8FAF3E', borderRadius: '0 300px 0 0', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', backgroundColor: '#e2e8f0', borderRadius: '0 0 0 300px', zIndex: 1 }} />

      {/* Title: Dasar Hukum */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <m.div variants={varFade().inUp}>
            <Typography sx={{ color: '#6EC207' }} variant="h4" align="center" gutterBottom>
              Dasar Hukum
            </Typography>
          </m.div>
        </Grid>

        {/* PDF Cards */}
        <Grid container item xs={12} spacing={2}>
          {isLoading && <Typography>Loading...</Typography>}
          {error && <Typography>Error loading data!</Typography>}
          {Array.isArray(legalBasisData) && legalBasisData.length > 0 ? (
            legalBasisData.map((legalBasis) => (
              <Grid item xs={12} sm={6} md={6} key={legalBasis.id}>
                <m.div variants={varFade().inUp}>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    onClick={() => handleCardClick(legalBasis.id)}
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
                    <PictureAsPdfIcon fontSize="large" />
                    <Typography variant="body2">{legalBasis.name}</Typography>
                  </Stack>
                </m.div>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '200px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: 2,
                  boxShadow: 3,
                  p: 3,
                }}
              >
                <PictureAsPdfIcon fontSize="large" sx={{ color: '#BDBDBD', mb: 2 }} />
                <Typography variant="h6" align="center" sx={{ color: '#757575' }}>
                  No PDF data available.
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: '#9E9E9E', mt: 1 }}>
                  Please check back later or contact support for assistance.
                </Typography>
              </Box>
            </Grid>
          )}
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
                src={pdfToShow}
                width="100%"
                height="600px"
                style={{ border: 'none' }}
                title="PDF Preview"
              />
            </div>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
