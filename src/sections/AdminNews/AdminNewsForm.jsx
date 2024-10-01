import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/system/Unstable_Grid/Grid';
import {
  Button,
  Typography,
  MenuItem,
  InputAdornment,
  TextField,
  Chip,
  IconButton,
} from '@mui/material';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useCreateNews} from './view/fetchNews';
import { Close as CloseIcon } from '@mui/icons-material';
import { useFetchTagNews } from '../newsTag/view/fetchNewsTag';

export default function AdminNewsForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { mutate: CreateNews, isPending } = useCreateNews({
    onSuccess: () => {
      enqueueSnackbar('Berita berhasil dibuat', { variant: 'success' });
      reset();
    },
    onError: (error) => {
      enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
    },
  });

  const NewsSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .max(100, 'Title must be at most 100 characters'),
    content: Yup.string().required('Content is required'),
    status: Yup.string().oneOf(['published', 'archived'], 'Invalid status').nullable(),
    thumbnail: Yup.mixed().required('Thumbnail is required'),
    news_tag_ids: Yup.array().min(1, 'At least one tag is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewsSchema),
    defaultValues: {
      title: '',
      content: '',
      status: 'archived',
      thumbnail: null,
      news_tag_ids: [],
    },
  });

  const { reset, handleSubmit, setValue, watch } = methods;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const { data: tagsResponse } = useFetchTagNews();
  const tags = tagsResponse?.data || [];

  const onSubmit = async (data) => {
    if (data.news_tag_ids.length === 0) {
      enqueueSnackbar('Please select at least one tag.', { variant: 'error' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('status', data.status);
      formData.append('thumbnail', data.thumbnail);
      formData.append('news_tag_ids', JSON.stringify(data.news_tag_ids));

      CreateNews(formData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTagSelect = (tagId) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((t) => t !== tagId);
      }
      return [...prev, tagId];
    });
  };

  useEffect(() => {
    setValue('news_tag_ids', selectedTags);
  }, [selectedTags, setValue]);

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue('thumbnail', file);
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailRemove = () => {
    setValue('thumbnail', null);
    setThumbnailPreview(null);
    const fileInput = document.getElementById('thumbnail-upload');
    if (fileInput) {
      fileInput.value = null;
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="title" label="Title" />
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Thumbnail:
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  style={{ display: 'none' }}
                  id="thumbnail-upload"
                />
                <label htmlFor="thumbnail-upload">
                  <Button variant="contained" component="span">
                    Upload Thumbnail
                  </Button>
                </label>
                {thumbnailPreview && (
                  <Box
                    sx={{
                      mt: 2,
                      position: 'relative',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '8px',
                    }}
                  >
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                    />
                    <IconButton
                      onClick={handleThumbnailRemove}
                      sx={{ position: 'absolute', top: 0, right: 0 }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <RHFTextField name="content" label="Content" multiline rows={4} />
              <RHFSelect name="status" label="Status">
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </RHFSelect>
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Tags:
                </Typography>
                <TextField
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
                  }}
                  fullWidth
                />
                <Box
                  mt={1}
                  sx={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    mt: 1,
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {selectedTags.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    return (
                      <Chip
                        key={tagId}
                        label={tag?.name}
                        onDelete={() => handleTagSelect(tagId)}
                        sx={{ margin: '4px' }}
                      />
                    );
                  })}
                </Box>
                <Box
                  sx={{
                    maxHeight: '150px',
                    overflowY: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    mt: 1,
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {filteredTags.length > 0 ? (
                    filteredTags.map((tag) => (
                      <MenuItem
                        key={tag.id}
                        onClick={() => handleTagSelect(tag.id)}
                        selected={selectedTags.includes(tag.id)}
                      >
                        {tag.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No tags found</MenuItem>
                  )}
                </Box>
              </Box>
            </Box>
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create News'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
