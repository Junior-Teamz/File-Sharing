import { useState, useEffect, useCallback } from 'react';
import { m } from 'framer-motion';
import { debounce } from 'lodash';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import ArticleIcon from '@mui/icons-material/Article';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import {
  Grid,
  Stack,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Pagination,
  Box,
  Chip,
  CardMedia,
} from '@mui/material';

// hooks
import { useFetchNews } from './view/fetchNews/useFetchNews';

// components
import { MotionViewport, varFade } from 'src/components/animate';
import { paths } from 'src/routes/paths';
import { shadows } from 'src/theme/shadows';

// theme
import { bgGradient } from 'src/theme/css';

export default function InformationAndAnnouncements() {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);

  const { data, isLoading, error } = useFetchNews({ searchQuery });

  // Mengurutkan berita berdasarkan tanggal terbaru
  const sortedNews = data?.data?.data?.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // Update filtered news ketika data atau halaman berubah
  useEffect(() => {
    if (sortedNews) {
      const itemsPerPage = 4;
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedData = sortedNews.slice(startIndex, startIndex + itemsPerPage);

      setFilteredNews(paginatedData);
    }
  }, [sortedNews, page]);

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((e) => {
      const value = e.target.value;

      setSearchQuery(value);
      setPage(1); // Reset page ketika mencari
    }, 1500),
    []
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0); // Scroll ke atas saat mengganti halaman
  };

  // Filter the news based on search query
  useEffect(() => {
    if (sortedNews) {
      const filteredData = sortedNews.filter((news) =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const itemsPerPage = 4;
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

      setFilteredNews(paginatedData);
    }
  }, [sortedNews, searchQuery, page]);

  const totalPages = Math.ceil((data?.data?.data?.length || 0) / 4);

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          ...bgGradient({
            color: alpha(
              theme.palette.background.default,
              theme.palette.mode === 'light' ? 0.88 : 0.94
            ),
            imgUrl: '/assets/background/overlay_2.jpg',
          }),
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      />
      <Container
        component={MotionViewport}
        sx={{
          py: { xs: 8, md: 15 },
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 4,
          }}
        >
          <TextField
            placeholder="Cari berita berdasarkan judul"
            variant="outlined"
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: theme.palette.primary.main }} />,
            }}
            sx={{
              width: { xs: '100%', sm: '70%', md: '50%' },
              borderRadius: '8px',
              boxShadow: `0px 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
              backgroundColor: theme.palette.background.paper,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </Box>

        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
          >
            <Typography variant="h6">Loading...</Typography>
          </Box>
        ) : error ? (
          <Typography variant="h6" align="center" color="error">
            Terjadi kesalahan saat mengambil berita: {error.message}
          </Typography>
        ) : filteredNews.length === 0 ? (
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
              mb: 4, 
            }}
          >
            <ArticleIcon fontSize="large" sx={{ mb: 2 }} />
            <Typography variant="h6" align="center">
              Tidak ada Berita yang tersedia.
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              Silakan periksa kembali nanti atau hubungi dukungan untuk bantuan.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={1} justifyContent="center">
            {filteredNews.map((news) => {
              const formattedDate = new Date(news.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });

              return (
                <Grid sx={{mx: 2}} xs={12} sm={6} md={4} key={news.id}>
                  <m.div variants={varFade().inUp}>
                    <Card
                      sx={{
                        transition: '0.3s',
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: shadows,
                        minHeight: { xs: 'auto', md: '400px' }, 
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        mb: 3,
                        '&:hover': {
                          boxShadow: `0px 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        src={news.thumbnail_url}
                        alt={news.title}
                        sx={{
                          objectFit: 'cover',
                          borderTopLeftRadius: '20px',
                          borderTopRightRadius: '20px',
                        }}
                      />
                      <CardContent
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          flexGrow: 1,
                          py: { xs: 1, md: 2 },
                        }}
                      >
                        <Box sx={{ mb: 0 }}>
                          {news.news_tags?.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag.name}
                              variant="outlined"
                              sx={{
                                borderRadius: '16px',
                                backgroundColor: '#e0e0e0',
                                mr: 0.5,
                                mb: 0.5,
                                fontSize: { xs: '0.75rem', md: '0.875rem' },
                              }}
                            />
                          ))}
                        </Box>

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

                        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                          <span dangerouslySetInnerHTML={{ __html: news.title }} />
                        </Typography>

                        <Typography
                          variant="body1"
                          sx={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitLineClamp: { xs: 1, md: 2 },
                            marginBottom: 2,
                          }}
                        >
                          <span dangerouslySetInnerHTML={{ __html: news.content }} />
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'center',
                            mt: 'auto',
                          }}
                        >
                          <Typography variant="body2" color="textSecondary">
                            <EventIcon sx={{ fontSize: 17, verticalAlign: 'middle', mr: 0.5 }} />
                            {formattedDate}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ color: 'primary.main' }}
                            onClick={() =>
                              (window.location.href = `${paths.news.detail}/${news.slug}`)
                            }
                          >
                            Baca Selengkapnya
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </m.div>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Box>
      </Container>
    </Box>
  );
}
