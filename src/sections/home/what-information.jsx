import { useState, useEffect, useCallback } from 'react';
import { m } from 'framer-motion';
import { debounce } from 'lodash';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/system/Unstable_Grid/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CardMedia from '@mui/material/CardMedia';
import { Icon } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';

// hooks
import { useFetchNews } from './view/fetchNews/useFetchNews';

// components
import { MotionViewport, varFade } from 'src/components/animate';
import { paths } from 'src/routes/paths';
import { shadows } from 'src/theme/shadows';

// ----------------------------------------------------------------------

export default function InformationAndAnnouncements() {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const { data, isLoading } = useFetchNews({ searchQuery });

  useEffect(() => {
    if (data) {
      setNewsData(data.data?.data || []);
      setTotalPages(data.data?.last_page || 1);
    }
    setLoading(isLoading);
  }, [data, isLoading]);

  const handleSearch = useCallback(
    debounce((e) => {
      setSearchQuery(e.target.value);
      setPage(1); // Reset page when searching
    }, 1500),
    []
  );

  const handlePageChange = useCallback((event, value) => {
    setLoading(true); // Set loading to true when page changes
    setPage(value);
    window.scrollTo(0, 0); // Scroll to top on page change
  }, []);

  // Calculate filtered news data based on the search query
  const filteredNewsData = newsData.filter((news) =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the number of items to display per page
  const itemsPerPage = 4;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNewsData = filteredNewsData.slice(startIndex, endIndex);

  return (
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

      {loading ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}
        >
          <Typography variant="h6">Loading...</Typography>
        </Box>
      ) : error ? (
        <Typography variant="h6" align="center" color="error">
          Terjadi kesalahan saat mengambil berita: {error.message}
        </Typography>
      ) : currentNewsData.length === 0 ? (
        <Typography variant="h6" align="center">
          Tidak ada berita ditemukan.
        </Typography>
      ) : (
        <Grid container spacing={10} justifyContent="center">
          {currentNewsData.map((news) => {
            const formattedDate = new Date(news.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <Grid xs={12} sm={6} md={6} key={news.id}>
                <m.div variants={varFade().inUp}>
                  <Card
                    sx={{
                      transition: '0.3s',
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: shadows,
                      height: { xs: 'auto', md: '450px' },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
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
                        {news.news_tags.map((tag, index) => (
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

                      <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                        <span dangerouslySetInnerHTML={{ __html: news.title }} />
                      </Typography>

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          display: { xs: 'none', md: '-webkit-box' },
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          WebkitLineClamp: 2,
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
                          variant="contained"
                          color="secondary"
                          onClick={() =>
                            (window.location.href = `${paths.news.detail}/${news.slug}`)
                          }
                          sx={{
                            backgroundColor: '#80b918',
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            '&:hover': {
                              backgroundColor: '#55a630',
                            },
                          }}
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

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Pagination
          count={Math.ceil(filteredNewsData.length / itemsPerPage) || 1} // Ensure count is at least 1
          page={page}
          onChange={handlePageChange}
          color="primary"
          boundaryCount={1}
          variant="outlined"
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: '8px',
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
              },
            },
          }}
        />
      </Box>
    </Container>
  );
}