import { useEffect, useState } from 'react';
import { useUpdateNews } from './view/fetchNews';
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  IconButton,
  MenuItem,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { Editor } from '@tinymce/tinymce-react';
import CloseIcon from '@mui/icons-material/Close';
import { TINY_API } from 'src/config-global';
import PropTypes from 'prop-types';
import { RHFAutocomplete } from 'src/components/hook-form';
import { useIndexTag } from '../tag/view/TagMutation'; // Import useIndexTag
import { useForm, FormProvider } from 'react-hook-form';

export default function AdminNewsEdit({ NewsId, data, open, onClose, initialNews }) {
  const { mutateAsync: updateNews, isLoading: isUpdating } = useUpdateNews();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [editingNews, setEditingNews] = useState(
    initialNews || { title: '', content: '', status: '', thumbnail_url: '', news_tag_ids: [] }
  );
  const [thumbnailPreview, setThumbnailPreview] = useState(editingNews.thumbnail_url || '');
  const [selectedTags, setSelectedTags] = useState(editingNews.news_tag_ids || []);
  const { tags } = useIndexTag(); // Ambil data tag menggunakan useIndexTag

  const methods = useForm();

  useEffect(() => {
    if (open) {
      setEditingNews(initialNews || {});
      setThumbnailPreview(initialNews?.thumbnail_url || '');
      setSelectedTags(initialNews?.news_tag_ids || []);
    }
  }, [initialNews, open]);

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setEditingNews((prev) => ({ ...prev, thumbnail_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailRemove = () => {
    setThumbnailPreview('');
    setEditingNews((prev) => ({ ...prev, thumbnail_url: '' }));
  };

  const handleEditAction = async () => {
    if (!editingNews.title || !editingNews.content) {
      enqueueSnackbar('Title dan content harus diisi!', { variant: 'error' });
      return;
    }

    try {
      const { title, content, status, thumbnail_url } = editingNews;

      const updateData = {
        title: title || undefined,
        content: content || undefined,
        status: status || undefined,
        thumbnail_url: thumbnail_url || undefined,
        news_tag_ids: selectedTags, // Ambil tags yang dipilih dari state
      };

      await updateNews({ id: NewsId, data: updateData });
      enqueueSnackbar('Berita berhasil diperbarui', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['list.news'] });
      onClose();
    } catch (error) {
      console.error('Error memperbarui berita:', error);
      enqueueSnackbar('Gagal memperbarui berita', { variant: 'error' });
    }
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit News</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Please update the news information below.
          </DialogContentText>
          <TextField
            {...methods.register('title')}
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={editingNews?.title || ''}
            onChange={(e) => setEditingNews((prev) => ({ ...prev, title: e.target.value }))}
          />

          <Editor
            apiKey={TINY_API}
            initialValue={editingNews?.content || ''}
            init={{
              height: 300,
              menubar: false,
              plugins: ['link', 'lists', 'image', 'table'],
              toolbar:
                'undo redo | styleselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image',
            }}
            onEditorChange={(content) => setEditingNews((prev) => ({ ...prev, content }))}
          />
          <TextField
            select
            margin="dense"
            id="status"
            name="status"
            label="Status"
            fullWidth
            variant="outlined"
            value={editingNews?.status || ''}
            onChange={(e) => setEditingNews((prev) => ({ ...prev, status: e.target.value }))}
          >
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </TextField>

          {/* RHFAutocomplete untuk memilih tag */}
          <RHFAutocomplete
            options={tags} // Menggunakan data tag dari useIndexTag
            value={selectedTags}
            onChange={(event, newValue) => setSelectedTags(newValue)}
            multiple
            renderInput={(params) => (
              <TextField {...params} label="Tags" variant="outlined" margin="dense" />
            )}
          />

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
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleEditAction} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}

AdminNewsEdit.propTypes = {
  NewsId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialNews: PropTypes.object,
  data: PropTypes.shape({
    tags: PropTypes.array.isRequired, // Pastikan data tags ada dalam props
  }).isRequired,
};
