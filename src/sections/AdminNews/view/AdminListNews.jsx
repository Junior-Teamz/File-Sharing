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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  MenuItem,
} from '@mui/material';
import React, { useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomPopover from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { useDeleteLegal, useFetchNews, useUpdateNews } from './fetchNews';
import { useSnackbar } from 'notistack';

export default function AdminListNews() {
  const settings = useSettingsContext();
  const { data: newsData, isLoading } = useFetchNews();
  const deleteNews = useDeleteLegal();
  const { mutateAsync: updateNews, isLoading: isUpdating } = useUpdateNews();
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [popover, setPopover] = useState({ open: false, anchorEl: null, currentId: null });
  const [editingNews, setEditingNews] = useState(null);

  const handleDelete = async (id) => {
    try {
      await deleteNews.mutateAsync(id);
      enqueueSnackbar('News deleted successfully', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to delete news', { variant: 'error' });
    }
  };

  const handleEditAction = async (id) => {
    if (!id) {
      console.error('News ID is required for update');
      enqueueSnackbar('News ID is required', { variant: 'error' });
      return;
    }

    if (editingNews) {
      try {
        const { title, content, status, thumbnail } = editingNews;

        // Construct data for the API call
        const updateData = {
          title: title || undefined,
          content: content || undefined,
          status: status || undefined,
          thumbnail: thumbnail || undefined,
          news_tag_ids: editingNews.news_tag_ids || undefined,
        };

        await updateNews({ newsId: id, data: updateData });
        enqueueSnackbar('News updated successfully', { variant: 'success' });
        handleEditDialogClose();
      } catch (error) {
        console.error('Error updating news:', error);
        enqueueSnackbar('Failed to update news', { variant: 'error' });
      }
    } else {
      const newsToEdit = newsData?.data?.data.find((news) => news.id === id);
      setEditingNews(newsToEdit);
      setEditDialogOpen(true);
    }
  };

  const handlePopoverOpen = (event, id) => {
    setPopover({ open: true, anchorEl: event.currentTarget, currentId: id });
  };

  const handlePopoverClose = () => {
    setPopover({ open: false, anchorEl: null, currentId: null });
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingNews(null);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'News List', href: paths.dashboard.AdminNews },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.AdminNews.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New News
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Scrollbar>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Thumbnail</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : newsData?.data?.data.length > 0 ? (
                newsData.data.data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(({ id, title, content, status, thumbnail }) => (
                    <TableRow key={id}>
                      <TableCell>{title}</TableCell>
                      <TableCell>{content}</TableCell>
                      <TableCell>{status}</TableCell>
                      <TableCell>
                        <img src={thumbnail} alt={title} style={{ width: '100px' }} />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="More Actions" placement="top">
                          <IconButton onClick={(event) => handlePopoverOpen(event, id)}>
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No news available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={newsData?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Scrollbar>

      {/* Modal for editing news */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
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
          <TextField
            margin="dense"
            id="content"
            name="content"
            label="Content"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={editingNews?.content || ''}
            onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
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
          <TextField
            margin="dense"
            id="thumbnail"
            name="thumbnail"
            label="Thumbnail URL"
            type="text"
            fullWidth
            variant="outlined"
            value={editingNews?.thumbnail || ''}
            onChange={(e) => setEditingNews({ ...editingNews, thumbnail: e.target.value })}
          />
          <DialogActions>
            <Button variant="outlined" onClick={handleEditDialogClose}>
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleEditAction(editingNews?.id)}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={handlePopoverClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem onClick={() => handleDelete(popover.currentId)} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" /> Delete
        </MenuItem>
        <MenuItem onClick={() => handleEditAction(popover.currentId)}>
          <Iconify icon="solar:pen-bold" /> Edit
        </MenuItem>
      </CustomPopover>
    </Container>
  );
}
