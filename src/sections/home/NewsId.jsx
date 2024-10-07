import { useEffect, useState } from 'react';
import { useFetchNewsSlug } from './view/fetchNews/useFetchNewsId';
import { useParams } from 'react-router-dom';
import { Grid, Typography, CircularProgress, Chip, CardMedia, Avatar } from '@mui/material';

export default function NewsId() {
  const { slug } = useParams();
  const { data: news, isLoading, error } = useFetchNewsSlug(slug);

  const formattedDate = new Date(news.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (isLoading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </div>
    );

  if (error || !news)
    return <div style={{ textAlign: 'center', padding: '20px' }}>Tidak ada berita!</div>;

  return (
    <Grid container justifyContent="center" sx={{ padding: '20px' }}>
      {/* Konten Berita */}
      <Grid item xs={12} md={10}>
        {/* Gambar Thumbnail */}
        <CardMedia
          component="img"
          height="auto" // Set height to auto for responsive design
          width="100%" // Maintain width at 100%
          image={news.thumbnail}
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
          {news.news_tags?.map((tag, index) => (
            <Chip
              key={index}
              label={tag.name}
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
          <div dangerouslySetInnerHTML={{ __html: news.title }} />
        </Typography>

        {/* Penulis & Tanggal */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Avatar
            alt={news.creator || 'Unknown'}
            src={news.creator_avatar} // Jika ada URL avatar penulis, bisa ditambahkan di sini
            sx={{ marginRight: '8px' }}
          />
          <Typography variant="body1" color="textSecondary" sx={{ marginRight: '8px' }}>
            {news.creator || 'Unknown'}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ marginRight: '8px' }}>
            -
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {formattedDate}
          </Typography>
        </div>

        {/* Isi Berita */}
        <Typography variant="body1" color="textPrimary" paragraph>
          <div dangerouslySetInnerHTML={{ __html: news.content }} />
        </Typography>
      </Grid>
    </Grid>
  );
}
