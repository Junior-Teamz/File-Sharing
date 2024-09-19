import { Button, Stack, Typography, Grid } from '@mui/material';
import { paths } from 'src/routes/paths';
import { m } from 'framer-motion';
import { varFade } from 'src/components/animate';

export default function Informasi() {
  const latestNews = [
    {
      id: 1,
      title: 'Pengumuman Ujian Nasional',
      summary: 'Persiapan untuk ujian nasional akan dilaksanakan pada akhir bulan.',
    },
    {
      id: 2,
      title: 'Informasi Libur Sekolah',
      summary: 'Sekolah akan diliburkan selama satu minggu untuk perayaan hari besar nasional.',
    },
  ];

  return (
    <Grid
      container
      item
      xs={12}
      md={12}
      sx={{ position: 'relative', backgroundColor: '#f9f9f9', overflow: 'hidden', minHeight: '100vh' }}
    >
      {/* Background Shapes */}
      <div
        style={{
          position: 'absolute',
          top: '-50px', // Adjust position to make it more visible
          left: '-50px',
          width: '200px',
          height: '100px',
          backgroundColor: '#8FAF3E', // Hijau Avocado
          borderRadius: '0 0 300px 0',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-50px', // Adjust position to make it more visible
          right: '-50px',
          width: '100px',
          height: '200px',
          backgroundColor: '#e2e8f0', // Abu-abu
          borderRadius: '0 0 0 300px',
          zIndex: 1,
        }}
      />

      <Grid item xs={12}>
        <m.div variants={varFade().inUp}>
          <Typography variant="h4" align="center" sx={{ mt: 10, mb: 5, color: '#6EC207' }} gutterBottom>
            Informasi & Pengumuman
          </Typography>
        </m.div>
      </Grid>

      {/* News Cards */}
      <Grid item xs={12}>
        <Grid container spacing={2} justifyContent="center">
          {latestNews.map((news) => (
            <Grid item xs={12} sm={6} md={5} key={news.id}>
              <m.div variants={varFade().inUp}>
                <Stack
                  alignItems="flex-start"
                  spacing={2}
                  sx={{
                    p: 4, // Reduced padding
                    borderRadius: 2, // Adjust border radius
                    backgroundColor: 'primary.main',
                    color: 'common.white',
                    cursor: 'pointer',
                    textAlign: 'center', // Center the text inside the card
                    mx: 'auto', // Center horizontally
                    zIndex: 1,
                  }}
                >
                  <Typography variant="h4">{news.title}</Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      maxWidth: 400, // Tentukan batas lebar maksimum untuk kolom address
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'initial',
                    }}
                  >
                    {news.summary}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => (window.location.href = `/berita/${news.id}`)}
                    sx={{
                      mt: 2,
                      backgroundColor: '#80b918',
                      '&:hover': {
                        backgroundColor: '#55a630',
                      },
                    }}
                  >
                    Baca Selengkapnya
                  </Button>
                </Stack>
              </m.div>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* More... Button */}
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 10 }}>
        <m.div variants={varFade().inUp}>
          <Button
            variant="contained"
            onClick={() => (window.location.href = paths.informasi)}
            sx={{
              backgroundColor: 'primary.main',
              color: 'common.white',
              px: 4,
              py: 1,
              transition: 'transform 0.3s ease-in-out, backgroundColor 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Lihat Selengkapnya...
          </Button>
        </m.div>
      </Grid>
    </Grid>
  );
}
