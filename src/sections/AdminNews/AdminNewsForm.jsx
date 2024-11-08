// Import necessary components and hooks
import { useState, useEffect, useRef } from 'react';
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
import FormProvider, { RHFTextField, RHFSelect, RHFAutocomplete } from 'src/components/hook-form';
import { useRouter } from 'src/routes/hooks';
import { useCreateNews } from './view/fetchNews';
import { Close as CloseIcon } from '@mui/icons-material';
import { useFetchTagNews } from '../newsTag/view/fetchNewsTag';
import { TINY_API } from 'src/config-global';
import { useQueryClient } from '@tanstack/react-query';
import { paths } from 'src/routes/paths';
import { useIndexTag } from '../tag/view/TagMutation';

export default function AdminNewsForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: CreateNews, isPending } = useCreateNews({
    onSuccess: () => {
      enqueueSnackbar('Berita berhasil dibuat', { variant: 'success' });
      reset();
      router.push(paths.dashboard.AdminNews.list);
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

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const [editorLoading, setEditorLoading] = useState(true);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const { data: tagsResponse } = useIndexTag();
  const tags = Array.isArray(tagsResponse?.data) ? tagsResponse.data : [];

  useEffect(() => {
    methods.register('news_tag_ids', {
      required: true,
      validate: (value) => value.length > 0 || 'Minimal di isi satu tag berita',
    });
  }, [methods]);

  const onSubmit = (data) => {
    if (data.news_tag_ids.length === 0) {
      enqueueSnackbar('Pilih minimal satu tag.', { variant: 'warning' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('status', data.status);
      formData.append('thumbnail', data.thumbnail);

      // Add each selected tag ID to FormData
      data.news_tag_ids.forEach((tagId) => formData.append('news_tag_ids[]', tagId));

      CreateNews(formData); // Panggil fungsi CreateNews
    } catch (error) {}
  };

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
        <Grid xs={12}>
          <Card sx={{ p: 3, boxShadow: 2 }}>
            <Grid container spacing={3}>
              {/* Title Section */}
              <Grid xs={12} sm={6}>
                <Typography variant="h6">Judul:</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  {...methods.register('title')}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>

              {/* Content Section */}
              <Grid xs={12} sm={6}>
                <Typography variant="h6">Isi:</Typography>
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
                  onEditorChange={(content) =>
                    setValue('content', content, { shouldValidate: true })
                  }
                />
                {errors.content && (
                  <Typography color="error" variant="caption">
                    {errors.content.message}
                  </Typography>
                )}
              </Grid>

              {/* Thumbnail Upload Section */}
              <Grid xs={12} sm={6}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Thumbnail:
                  </Typography>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    style={{ display: 'none' }}
                    error={!!errors.thumbnail}
                    helperText={errors.thumbnail?.message}
                    id="thumbnail-upload"
                  />
                  <label htmlFor="thumbnail-upload">
                    <Button variant="contained" component="span">
                      Upload Thumbnail
                    </Button>
                  </label>
                  {errors.thumbnail && (
                    <Typography color="error" variant="caption">
                      {errors.thumbnail.message}
                    </Typography>
                  )}
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
              <Grid xs={12} sm={6}>
                <RHFSelect
                  name="status"
                  label="Status"
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  <MenuItem value="published">Publik</MenuItem>
                  <MenuItem value="archived">Arsip</MenuItem>
                </RHFSelect>
              </Grid>

              {/* Tags Section */}
              <Grid xs={12}>
                <Typography variant="h6">Tag:</Typography>
                <RHFAutocomplete
                  name="tag"
                  label="Tag"
                  multiple
                  options={tags}
                  getOptionLabel={(option) => option?.name || ''} // Handle undefined options gracefully
                  onChange={(event, value) => {
                    // Map selected options to their IDs
                    const selectedIds = value?.map((tag) => tag?.id) ?? []; // Handle case where value is null
                    setValue('news_tag_ids', selectedIds);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.news_tag_ids}
                      helperText={errors.news_tag_ids?.message}
                      variant="outlined"
                      placeholder="Pilih Tag Berita"
                    />
                  )}
                  renderTags={(value, getTagProps) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {value?.map((tag, index) =>
                        tag?.id && tag?.name ? (
                          <Chip key={tag.id} label={tag.name} {...getTagProps({ index })} />
                        ) : null
                      )}
                    </Box>
                  )}
                />

                {errors.news_tag_ids && (
                  <Typography color="error" variant="caption">
                    {errors.news_tag_ids.message}
                  </Typography>
                )}
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
              <Button variant="contained" type="submit" disabled={isPending}>
                {isPending ? <CircularProgress size={24} /> : 'Buat berita'}
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
