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

// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import { useFetchNews } from './view/fetchNews/useFetchNews';

// components
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function InformationAndAnnouncements() {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const isLight = theme.palette.mode === 'light';
  const shadow = `-40px 40px 80px ${alpha(
    isLight ? theme.palette.grey[500] : theme.palette.common.black,
    0.24
  )}`;

  // State for pagination and news data
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedNews, setExpandedNews] = useState({}); // State to manage expanded news content
  const [error, setError] = useState(null); // State for error handling

  // Fetch news using custom hook
  const { data, isLoading } = useFetchNews({ page, searchQuery });

  useEffect(() => {
    if (data) {
      console.log('Full Response:', data); // Log the full response
      // Ensure to access the correct nested data structure
      setNewsData(data.data?.data || []); // Access nested data safely
      setTotalPages(data.data?.last_page || 1); // Access total pages safely
    }
    setLoading(isLoading);
  }, [data, isLoading]);

  // Handle search with debounce
  const handleSearch = useCallback(
    debounce((e) => {
      setSearchQuery(e.target.value);
      setPage(1); // Reset to first page on new search
    }, 1500),
    []
  );

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const toggleExpand = useCallback((id) => {
    setExpandedNews((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  }, []);

  // Filtered news data based on search query
  const filteredNewsData = newsData.filter((news) =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
        textAlign: { xs: 'center', md: 'unset' },
      }}
    >
      {/* Search Field */}
      <TextField
        label="Cari berita..."
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        onChange={handleSearch}
      />

      {/* Content section */}
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
      ) : filteredNewsData.length === 0 ? (
        <Typography variant="h6" align="center">
          Tidak ada berita ditemukan.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {filteredNewsData.map((news) => (
            <Grid xs={12} md={6} key={news.id}>
              <m.div variants={varFade().inUp}>
                <Card
                  sx={{
                    boxShadow: shadow,
                    borderRadius: 2,
                    bgcolor: isLight ? 'background.paper' : 'grey.800',
                  }}
                >
                  <CardContent>
                    <img
                      src={news.thumbnail}
                      alt={news.title}
                      style={{ width: '100%', height: 'auto', marginBottom: '16px', objectFit: 'cover' }}
                    />
                    <Typography variant="h5" gutterBottom>
                      {news.title}
                    </Typography>

                    {/* Map through news_tags array as Chips */}
                    <Box sx={{ mb: 2 }}>
                      {news.news_tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag.name}
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }} // Margin for spacing
                        />
                      ))}
                    </Box>

                    {/* Content display with length limitation */}
                    <Typography sx={{ mb: 2 }}>
                      {expandedNews[news.id]
                        ? news.content
                        : `${news.content.substring(0, 100)}...`}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => toggleExpand(news.id)}>
                      {expandedNews[news.id] ? 'Tutup' : 'Selengkapnya'}
                    </Button>
                  </CardContent>
                </Card>
              </m.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
      </Box>
    </Container>
  );
}
