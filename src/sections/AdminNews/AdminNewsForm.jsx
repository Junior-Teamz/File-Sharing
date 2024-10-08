import { useState, useEffect } from 'react';
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
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { useRouter } from 'src/routes/hooks';
import { useCreateNews } from './view/fetchNews';
import { Close as CloseIcon } from '@mui/icons-material';
import { useFetchTagNews } from '../newsTag/view/fetchNewsTag';
import { TINY_API } from 'src/config-global';
import { useQueryClient } from '@tanstack/react-query';
import { paths } from 'src/routes/paths';

export default function AdminNewsForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: CreateNews, isPending } = useCreateNews({
    onSuccess: () => {
      enqueueSnackbar('Berita berhasil dibuat', { variant: 'success' });
      reset();
      router.push(paths.dashboard.AdminNews.list); // Redirect to the news list
      queryClient.invalidateQueries({ queryKey: ['list.news'] });
    },
    onError: (error) => {
      enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
    },
  });

  const NewsSchema = Yup.object().shape({
    title: Yup.string().required('Judul harus di isi').max(100, 'Judul maksimal 100 karakter'),
    content: Yup.string().required('Content harus di isi'),
    status: Yup.string().oneOf(['published', 'archived'], 'Status tidak valid').nullable(),
    thumbnail: Yup.mixed().required('Thumbnail harus di isi'),
    news_tag_ids: Yup.array().min(1, 'Minimal di isi satu tag berita'),
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

  const [editorLoading, setEditorLoading] = useState(true);
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
      data.news_tag_ids.forEach((tagId) => {
        formData.append('news_tag_ids[]', tagId);
      });

      CreateNews(formData);
    } catch (error) {
      console.error('Submission Error:', error);
    }
  };

  const handleTagSelect = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
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
      reader.onload = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailRemove = () => {
    setValue('thumbnail', null);
    setThumbnailPreview(null);
    document.getElementById('thumbnail-upload').value = null;
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, boxShadow: 2 }}>
            <Grid container spacing={3}>
              {/* Title Section */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Title:</Typography>
                {editorLoading && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <CircularProgress />
                  </Box>
                )}
                <Editor
                  apiKey={TINY_API}
                  value={watch('title')}
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'print',
                      'preview',
                      'anchor',
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
                  }}
                  onInit={() => setEditorLoading(false)}
                  onEditorChange={(content) => setValue('title', content)}
                />
              </Grid>

              {/* Content Section */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Content:</Typography>
                {editorLoading && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <CircularProgress />
                  </Box>
                )}
                <Editor
                  apiKey={TINY_API}
                  value={watch('content')}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'print',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'code',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table',
                      'paste',
                      'help',
                      'wordcount',
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                  }}
                  onInit={() => setEditorLoading(false)}
                  onEditorChange={(content) => setValue('content', content)}
                />
              </Grid>

              {/* Thumbnail Upload Section */}
              <Grid item xs={12} sm={6}>
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
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                      />
                      <IconButton
                        onClick={handleThumbnailRemove}
                        sx={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Status Section */}
              <Grid item xs={12} sm={6}>
                <RHFSelect name="status" label="Status">
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </RHFSelect>
              </Grid>

              {/* Tags Section */}
              <Grid xs={12}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Tag berita:
                </Typography>
                <TextField
                  placeholder="Cari tag berita..."
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
                    padding: '4px', // Reduced padding for a smaller look
                    maxHeight: '100px', // Set a maximum height for the scroll area
                    overflowY: 'auto', // Enable vertical scrolling
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                  }}
                >
                  {filteredTags.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      color={selectedTags.includes(tag.id) ? 'primary' : 'default'}
                      onClick={() => handleTagSelect(tag.id)}
                      variant="outlined"
                      sx={{
                        padding: '2px 4px', // Adjust padding for smaller size
                        fontSize: '0.8rem', // Smaller font size
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>

            <Stack spacing={2} direction="row" sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" disabled={isPending}>
                {isPending ? <CircularProgress size={24} /> : 'Create News'}
              </Button>
              <Button variant="outlined" onClick={() => reset()} disabled={isPending}>
                Reset
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

AdminNewsForm.propTypes = {
  handleSubmit: PropTypes.func,
  reset: PropTypes.func,
};
