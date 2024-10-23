import { useEffect } from 'react';
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

  useEffect(() => {
    if (news) {
      document.title = news.title;

      const metaTags = {
        title: document.querySelector('meta[property="og:title"]'),
        description: document.querySelector('meta[property="og:description"]'),
        image: document.querySelector('meta[property="og:image"]'),
        url: document.querySelector('meta[property="og:url"]'),
        appId: document.querySelector('meta[property="fb:app_id"]'),
      };

      if (metaTags.title) {
        metaTags.title.setAttribute('content', news.title);
      }
      if (metaTags.description) {
        metaTags.description.setAttribute('content', news.description || 'Berita terbaru.');
      }
      if (metaTags.image) {
        metaTags.image.setAttribute('content', news.thumbnail_url); // Gambar dinamis
      }
      if (metaTags.url) {
        metaTags.url.setAttribute('content', window.location.href);
      }
    }
  }, [news]);

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
      <Grid
        item
        xs={12}
        md={12}
        sx={{ display: 'flex', alignItems: 'flex-start', }}
      >
        <CustomBreadcrumbs
          links={[
            {
              name: 'Home',
              href: '/',
            },
            {
              name: 'Daftar Berita',
              href: paths.news.informasi,
            },
            {
              name: <span dangerouslySetInnerHTML={{ __html: news.title }} />,
              href: '',
            },
          ]}
          sx={{
            mb: { xs: 3, md: 4 },
            mt: { xs: 2, md: 2 },
         
          }}
        />
      </Grid>

      {/* Main content centered */}
      <Grid item xs={12} md={10} sx={{ mx: 'auto', mt: 5, maxWidth: '800px' }}>
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
            lineHeight: 1.6,
            marginBottom: 0,
            overflowWrap: 'break-word',
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: news.content }} />
        </Typography>
      </Grid>
    </Grid>
  );
}
