import React, { useState, useEffect, useCallback } from 'react';
import { m } from 'framer-motion';
// @mui
import { Stack, Container, Typography, Grid, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { MotionViewport, varFade } from 'src/components/animate';
import { useFetchLegall } from './view/fetcLegalbasis/useFetchLegal';

// ----------------------------------------------------------------------

const PdfCard = React.memo(({ legalBasis, onClick }) => (
  <Grid item xs={12} sm={6} md={6} key={legalBasis.id}>
    <m.div variants={varFade().inUp}>
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={1}
        onClick={onClick}
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
));

export default function HomeLookingFor() {
  const [pdfToShow, setPdfToShow] = useState(null);
  const { data: legalBasisData = [], error, isLoading } = useFetchLegall();
  
  // Store the PDFs in state for quicker access
  const [pdfUrls, setPdfUrls] = useState({});

  useEffect(() => {
    // Preload PDF URLs into state
    const urls = {};
    legalBasisData.forEach(item => {
      urls[item.id] = item.file_url;
    });
    setPdfUrls(urls);
  }, [legalBasisData]);

  const handleCardClick = useCallback((id) => {
    // Check if PDF is already in urls state
    const selectedPdfUrl = pdfUrls[id];
    if (selectedPdfUrl) {
      // Use Google Docs Viewer to display the PDF
      setPdfToShow(`https://docs.google.com/gview?url=${selectedPdfUrl}&embedded=true`);
    }
  }, [pdfUrls]);

  const handleClose = () => setPdfToShow(null);

  return (
    <Container component={MotionViewport} sx={{ py: { xs: 10, md: 15 }, position: 'relative' }}>
      {/* Decorative Elements */}
      <div
        style={{
          position: 'absolute',
          bottom: '0px',
          left: '-29px',
          width: '100px',
          height: '80px',
          backgroundColor: '#8FAF3E',
          borderRadius: '0 300px 0 0',
          zIndex: 0,
        }}
      />

      <svg
        xmlns="http://www.w3.org/2000/svg" // wave shape
        viewBox="0 0 1440 320"
        style={{
          position: 'absolute',
          top: -200,
          width: '180%',
          height: '494px',
          zIndex: 0,
          transform: 'scaleY(-1)',
        }}
      >
        <path
          fill="#6EC207"
          fillOpacity="1"
          d="M0,224L60,213.3C120,203,240,181,360,160C480,139,600,117,720,122.7C840,128,960,160,1080,165.3C1200,171,1320,149,1380,138.7L1440,128V320H1380H1200H1080H960H840H720H600H480H360H240H120H60H0Z"
        />
      </svg>

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
        <Grid container item xs={12} spacing={2} sx={{ zIndex: 1 }}>
          {isLoading && <Typography>Loading...</Typography>}
          {error && <Typography>Error loading data!</Typography>}
          {Array.isArray(legalBasisData) && legalBasisData.length > 0 ? (
            legalBasisData.map((legalBasis) => (
              <PdfCard
                key={legalBasis.id}
                legalBasis={legalBasis}
                onClick={() => handleCardClick(legalBasis.id)}
              />
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
                  backgroundColor: 'primary.main',
                  color: 'common.white',
                  borderRadius: 2,
                  boxShadow: 3,
                  p: 3,
                }}
              >
                <PictureAsPdfIcon fontSize="large" sx={{ mb: 2 }} />
                <Typography variant="h6" align="center">
                  Tidak ada PDF yang tersedia.
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  Silakan periksa kembali nanti atau hubungi dukungan untuk bantuan.
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
                  left: 8,
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
