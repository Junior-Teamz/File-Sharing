import { useEffect, useState } from 'react';
import { useFetchNewsSlug } from './view/fetchNews/useFetchNewsId';
import { useParams } from 'react-router-dom';
import { Grid, Typography, CircularProgress, Chip, CardMedia, Avatar } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function NewsId() {
  const { slug } = useParams();
  const { data: news, isLoading, error } = useFetchNewsSlug(slug);

  const formattedDate = news
    ? new Date(news.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error || !news) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Tidak ada berita!</div>;
  }

  return (
    <Grid container sx={{ padding: '20px' }}>
      {/* Custom Breadcrumbs on the left */}
      <Grid item xs={12} md={10} sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <CustomBreadcrumbs
          links={[
            {
              name: 'Dashboard',
              href: '/',
            },
            {
              name: 'Daftar Berita',
              href: paths.news.informasi,
            },
            {
              name: <span dangerouslySetInnerHTML={{ __html: news.title }} />,
              href: '', // You can set a specific href if needed
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
            fontSize: '1rem', // Increased font size
            '& .MuiTypography-root': {
              fontSize: '1rem', // Set font size for Typography
            },
          }}
        />
      </Grid>

      {/* Main content centered */}
      <Grid item xs={12} md={10} sx={{ mx: 'auto', maxWidth: '800px' }}>
        {/* Gambar Thumbnail */}
        <CardMedia
          component="img"
          height="auto" // Set height to auto for responsive design
          width="100%" // Maintain width at 100%
          image={news.thumbnail_url} // Use thumbnail_url instead of thumbnail
          alt={news.title}
          sx={{
            borderRadius: '20px', // Border radius untuk gambar
            objectFit: 'cover', // Ensure the image covers the container
            aspectRatio: '16/9', // Set the aspect ratio to landscape
            maxHeight: '500px', // Optional: Set a maximum height to maintain consistency
          }}
        />

        {/* Tags */}
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          {Array.isArray(news.news_tags) &&
            news.news_tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag.name} // Ensure tag has a name property
                variant="outlined"
                sx={{
                  marginRight: '8px',
                  marginTop: '4px',
                  borderRadius: '16px', // Membuat Chip menjadi rounded
                  backgroundColor: '#e0e0e0', // Background abu-abu
                }}
              />
            ))}
        </div>

        {/* Judul Berita */}
        <Typography variant="h4" component="h2" gutterBottom>
          <span dangerouslySetInnerHTML={{ __html: news.title }} />
        </Typography>

        {/* Penulis & Tanggal */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Avatar
            alt={news.creator?.name || 'Unknown'}
            src={news.creator_avatar}
            sx={{ marginRight: '8px' }}
          />
          <Typography variant="body1" color="textSecondary" sx={{ marginRight: '8px' }}>
            {news.creator?.name || 'Unknown'}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ marginRight: '8px' }}>
            -
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {formattedDate}
          </Typography>
        </div>

        {/* Isi Berita */}
        <Typography
          variant="body1"
          color="textPrimary"
          paragraph
          sx={{
            textAlign: 'justify',         
            textAlignLast: 'justify',    
            lineHeight: 1.6,              
            marginBottom: 0,              
            overflowWrap: 'break-word',  
            wordBreak: 'break-word',      
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: news.content }} />
        </Typography>
      </Grid>
    </Grid>
  );
}
