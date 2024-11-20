import React, { useState } from 'react';
import {
  Button,
  Container,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableBody,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomPopover from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { useDeleteNews, useFetchNews, useUpdateNews } from './fetchNews';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { Editor } from '@tinymce/tinymce-react';
import { TINY_API } from 'src/config-global';
import { useIndexTag } from 'src/sections/tag/view/TagMutation';
import { RHFAutocomplete } from 'src/components/hook-form';
import { useForm, FormProvider } from 'react-hook-form';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';

export default function AdminListNews() {
  const methods = useForm();
  const settings = useSettingsContext();
  const { data: newsData, isLoading } = useFetchNews();
  const deleteNews = useDeleteNews();
  const updateNews = useUpdateNews();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: tagsData } = useIndexTag();
  const availableTags = tagsData?.data || [];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [editedNews, setEditedNews] = useState({
    title: '',
    content: '',
    thumbnail_url: '',
    status: '',
    news_tags_ids: [],
  });
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [popoverCurrentId, setPopoverCurrentId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);

  const filteredNews = (newsData?.data?.data || []).filter((news) =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedNews = filteredNews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteNews.mutateAsync(id);
      enqueueSnackbar('Berita berhasil dihapus', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['list.news'] });
    } catch (error) {
      enqueueSnackbar('Gagal menghapus berita', { variant: 'error' });
    }
    setPopoverAnchor(null);
  };

  const handleEditSave = async (news = null) => {
    if (news) {
      const { id, title, content, thumbnail_url, status, news_tags_ids = [] } = news;
      if (!id) {
        enqueueSnackbar('ID berita tidak ditemukan.', { variant: 'error' });
        return;
      }
      console.log('Editing news ID:', id);
      setEditingNewsId(id);
      setEditedNews({ title, content, thumbnail_url, status, news_tags_ids });
      setDialogOpen(true);
      setPopoverAnchor(null);
    } else if (editingNewsId && editedNews.title && editedNews.content) {
      console.log('Saving edited news with ID:', editingNewsId);
      const payload = { id: editingNewsId, ...editedNews };
      console.log('Payload before sending to API:', payload);
      try {
        await updateNews.mutateAsync(payload);
        enqueueSnackbar('Berita berhasil diperbarui', { variant: 'success' });
        queryClient.invalidateQueries({ queryKey: ['list.news'] });
        setEditingNewsId(null);
        setDialogOpen(false);
      } catch (error) {
        console.error('Update error:', error);
        enqueueSnackbar('Gagal memperbarui berita', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('ID berita dan data harus ada untuk memperbarui.', { variant: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlePopoverOpen = (event, newsId) => {
    setPopoverAnchor(event.currentTarget);
    setPopoverCurrentId(newsId);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setPopoverCurrentId(null);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Daftar Berita', href: paths.dashboard.AdminNews },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.AdminNews.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Buat Berita Baru
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TextField
        variant="outlined"
        placeholder="Search News..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Scrollbar>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Thumbnail</TableCell>
                <TableCell>Judul</TableCell>
                <TableCell>Isi</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : sortedNews.length > 0 ? (
                sortedNews
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(({ id, title, content, status, thumbnail_url, news_tags_ids }) => (
                    <TableRow key={id}>
                      <TableCell>
                        <IconButton onClick={() => setZoomImage(thumbnail_url)}>
                          <Box
                            component="img"
                            src={thumbnail_url}
                            alt={title}
                            sx={{ maxWidth: '50%', height: 'auto' }}
                          />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <span dangerouslySetInnerHTML={{ __html: title }} />
                      </TableCell>
                      <TableCell>
                        <span
                          dangerouslySetInnerHTML={{ __html: content }}
                          style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            WebkitLineClamp: 3,
                          }}
                        />
                      </TableCell>
                      <TableCell>{status}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="More Actions" placement="top">
                          <IconButton onClick={(e) => handlePopoverOpen(e, id)}>
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </Tooltip>
                        <CustomPopover
                          anchorEl={popoverAnchor}
                          open={Boolean(popoverAnchor) && popoverCurrentId === id}
                          onClose={handlePopoverClose}
                        >
                          <MenuItem
                            onClick={() => handleDelete(popoverCurrentId)}
                            sx={{ color: 'error.main' }}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" /> Hapus
                          </MenuItem>
                          <Link
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            key={id}
                            to={`edit/${id}`}
                          >
                            <MenuItem>
                              <Iconify icon="solar:pen-bold" /> Edit
                            </MenuItem>
                          </Link>
                        </CustomPopover>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Tidak ada berita ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedNews.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit Berita</DialogTitle>
        <DialogContent>
          <FormProvider {...methods}>
            <TextField
              label="Judul"
              fullWidth
              value={editedNews.title}
              onChange={(e) => setEditedNews((prev) => ({ ...prev, title: e.target.value }))}
              sx={{ mt: 2, mb: 2 }}
            />
            <Editor
              apiKey={TINY_API}
              initialValue={editedNews.content}
              onEditorChange={(newText) => setEditedNews((prev) => ({ ...prev, content: newText }))}
              init={{
                height: 300,
                menubar: false,
                plugins: 'link image code',
                toolbar:
                  'undo redo | styleselect | bold italic | alignleft aligncenter alignright | code',
              }}
            />
            <TextField
              label="Thumbnail URL"
              fullWidth
              value={editedNews.thumbnail_url}
              onChange={(e) =>
                setEditedNews((prev) => ({ ...prev, thumbnail_url: e.target.value }))
              }
              sx={{ mt: 2 }}
            />
            <RHFAutocomplete
              name="tags"
              options={availableTags}
              getOptionLabel={(option) => option.name}
              multiple
              onChange={(event, newValue) =>
                setEditedNews((prev) => ({ ...prev, news_tags_ids: newValue.map((tag) => tag.id) }))
              }
              renderInput={(params) => <TextField {...params} label="Tags" />}
            />
            <TextField
              label="Status"
              fullWidth
              select
              value={editedNews.status}
              onChange={(e) => setEditedNews((prev) => ({ ...prev, status: e.target.value }))}
              sx={{ mt: 2 }}
            >
              <MenuItem value="published">Publik</MenuItem>
              <MenuItem value="archived">Arsip</MenuItem>
            </TextField>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Batal</Button>
          <Button onClick={() => handleEditSave()}>Simpan</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
