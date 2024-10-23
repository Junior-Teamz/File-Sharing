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
  MenuItem,
  Box,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { Editor } from '@tinymce/tinymce-react'; // Import TinyMCE editor
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import { RHFAutocomplete } from 'src/components/hook-form';
import { TINY_API } from 'src/config-global';

export default function AdminNewsEdit({ NewsId, open, onClose }) {
  const { mutateAsync: updateNews, isLoading: isUpdating } = useUpdateNews();
  const { enqueueSnackbar } = useSnackbar();
  const useClient = useQueryClient();
  const [editingNews, setEditingNews] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [availableTags, setAvailableTags] = useState([]); // State untuk menyimpan tags

  // Fetch news data when the component mounts or id changes
  useEffect(() => {
    const fetchNewsData = async () => {
      if (NewsId) {
        // Assume there's a function to get news data by ID
        const newsToEdit = await getNewsById(NewsId); // Replace with your fetching logic
        setEditingNews(newsToEdit);
        setThumbnailPreview(newsToEdit?.thumbnail_url || ''); // Set initial thumbnail preview
      }
    };

    fetchNewsData();

    // Fetch available tags (if they come from an API)
    const fetchAvailableTags = async () => {
      // Assume this function fetches the tags from an API
      const tags = await getAvailableTags(); // Replace with your tag fetching logic
      setAvailableTags(tags);
    };

    fetchAvailableTags();
  }, [NewsId]);

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setEditingNews({ ...editingNews, thumbnail_url: reader.result }); // Set thumbnail URL to the file data
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailRemove = () => {
    setThumbnailPreview('');
    setEditingNews({ ...editingNews, thumbnail_url: '' }); // Clear thumbnail URL in editingNews
  };

  const handleEditAction = async () => {
    if (!editingNews) {
      console.error('No news data to update');
      enqueueSnackbar('News data harus terisi!', { variant: 'error' });
      return;
    }

    try {
      const { title, content, status, thumbnail_url, news_tag_ids } = editingNews;

      // Construct data for the API call
      const updateData = {
        title: title || undefined,
        content: content || undefined,
        status: status || undefined,
        thumbnail_url: thumbnail_url || undefined,
        news_tag_ids: news_tag_ids || undefined,
      };

      await updateNews({ id: NewsId, data: updateData });
      enqueueSnackbar('Berita berhasil diperbarui', { variant: 'success' });
      useClient.invalidateQueries({ queryKey: ['list.news'] });
      onClose(); // Close the dialog
    } catch (error) {
      console.error('Error memperbarui berita:', error);
      enqueueSnackbar('Gagal memperbarui berita', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit News</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 3 }}>
          Please update the news information below.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={editingNews?.title || ''}
          onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
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
          onEditorChange={(content) => setEditingNews({ ...editingNews, content })}
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
          onChange={(e) => setEditingNews({ ...editingNews, status: e.target.value })}
        >
          <MenuItem value="published">Published</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </TextField>
        <RHFAutocomplete
          label="Tags"
          options={availableTags} // availableTags sekarang sudah didefinisikan
          value={editingNews?.news_tag_ids || []}
          onChange={(tags) => setEditingNews({ ...editingNews, news_tag_ids: tags })}
        />
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
  );
}
