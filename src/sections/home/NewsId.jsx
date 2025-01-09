import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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

  // Debug log to check what's inside `news`
  useEffect(() => {
    console.log('Fetched News:', news); // Log the fetched news data
  }, [news]);

  const formattedDate = news
    ? new Date(news.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  useEffect(() => {
    if (news && news.title) {
      document.title = news.title;
    }
  }, [news]);

  // Show loading spinner while the data is being fetched
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  // Check for error or empty data more thoroughly
  if (error || !news || !news.title || Object.keys(news).length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Berita Tidak Ditemukan
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Berita yang Anda cari tidak tersedia atau telah dihapus.
        </Typography>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{news.title}</title>
        <meta name="description" content={news.description} />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.description} />
        <meta property="og:image" content={news.thumbnail_url} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={news.title} />
        <meta name="twitter:description" content={news.description} />
        <meta name="twitter:image" content={news.thumbnail_url} />
        <meta name="twitter:url" content={window.location.href} />
      </Helmet>

      <Grid container sx={{ padding: '20px', justifyContent: 'center' }}>
        <Grid item xs={12} md={10} sx={{ maxWidth: '800px', mx: 'auto' }}>
          {/* Custom Breadcrumbs */}
          <CustomBreadcrumbs
            links={[
              { name: 'Home', href: '/' },
              { name: 'Daftar Berita', href: paths.news.informasi },
              { name: <span dangerouslySetInnerHTML={{ __html: news.title }} />, href: '' },
            ]}
            sx={{ mb: { xs: 3, md: 4 }, mt: { xs: 1, md: 1 } }}
          />
        </Grid>

        <Grid item xs={12} md={10} sx={{ maxWidth: '800px', mx: 'auto' }}>
          {/* Gambar Thumbnail */}
          <CardMedia
            component="img"
            height="auto"
            width="100%"
            image={news.thumbnail_url}
            alt={news.title}
            sx={{
              borderRadius: '20px',
              objectFit: 'cover',
              aspectRatio: '16/9',
              maxHeight: '500px',
            }}
          />

          {/* Tags */}
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            {Array.isArray(news.tags) &&
              news.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag.name}
                  variant="outlined"
                  sx={{
                    marginRight: '8px',
                    marginTop: '4px',
                    borderRadius: '16px',
                    backgroundColor: '#e0e0e0',
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
              src={news.creator?.photo_profile_url}
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
            sx={{ lineHeight: 1.6, marginBottom: 0, overflowWrap: 'break-word' }}
          >
            <span dangerouslySetInnerHTML={{ __html: news.content }} />
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
