import { useEffect, useState } from 'react';
import { useFetchNewsSlug } from './view/fetchNews/useFetchNewsId';
import { useParams } from 'react-router-dom';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
} from '@mui/material';

export default function NewsId() {
  const { slug } = useParams();
  const { data: news, isLoading, error } = useFetchNewsSlug(slug);

  // Loading state
  if (isLoading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </div>
    );

  // Error state
  if (error || !news)
    return <div style={{ textAlign: 'center', padding: '20px' }}>No news found!</div>;

  return (
    <Grid container sx={{my:'10px',}} spacing={2} justifyContent="center">
      <Grid item xs={12} md={8}>
        <Card>
          {/* News Thumbnail */}
          <CardMedia
            component="img"
            height="300"
            image={news.thumbnail}
            alt={news.title}
          />
          <CardContent>
            {/* News Title */}
            <Typography variant="h4" component="h2" gutterBottom>
              {news.title}
            </Typography>
            {/* Author */}
            <Typography variant="body1" color="textSecondary">
              Author: {news.creator || 'Unknown'}
            </Typography>
            {/* Publication Date */}
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {new Date(news.created_at).toLocaleDateString()}
            </Typography>
            {/* News Content */}
            <Typography variant="body1" color="textPrimary" paragraph>
              {news.content}
            </Typography>

            {/* Tags using MUI Chips */}
            <div style={{ marginTop: '10px' }}>
              {news.news_tags?.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={`${tag.name}`} 
                  variant="outlined" 
                  style={{ marginRight: '8px', marginTop: '4px' }} 
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
