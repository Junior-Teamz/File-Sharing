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

export default function AdminListNews() {
  const settings = useSettingsContext();
  const { data: newsData, isLoading } = useFetchNews(); // Fetch news data
  const deleteNews = useDeleteLegal(); // Delete API
  const updateNews = useUpdateNews(); // Update API

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [popover, setPopover] = useState({ open: false, anchorEl: null, currentId: null });
  const [editingNews, setEditingNews] = useState(null); // State for the news being edited

  const handleDelete = (id) => {
    deleteNews.mutate(id, {
      onSuccess: () => {
        alert('News deleted successfully');
      },
      onError: () => {
        alert('Failed to delete news');
      },
    });
  };

  const handleEdit = (id) => {
    if (!isLoading && Array.isArray(newsData?.data?.data)) {
      // Change from items to data
      const newsToEdit = newsData.data.data.find((news) => news.id === id);
      if (newsToEdit) {
        setEditingNews(newsToEdit);
        setEditDialogOpen(true);
      } else {
        console.error(`No news found with id: ${id}`);
      }
    } else {
      console.error('Data is still loading or newsData.data.data is not an array:', newsData);
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

  const handleEditSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    updateNews.mutate(editingNews, {
      onSuccess: () => {
        alert('News updated successfully');
        handleEditDialogClose();
      },
      onError: () => {
        alert('Failed to update news');
      },
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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
              {newsData?.data?.data?.length > 0 ? (
                newsData.data.data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((news) => (
                    <TableRow key={news.id}>
                      <TableCell>{news.title}</TableCell>
                      <TableCell>{news.content}</TableCell>
                      <TableCell>{news.status}</TableCell>
                      <TableCell>
                        <img src={news.thumbnail} alt={news.title} style={{ width: '100px' }} />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="More Actions" placement="top">
                          <IconButton onClick={(event) => handlePopoverOpen(event, news.id)}>
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
          <form onSubmit={handleEditSubmit}>
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
              value={editingNews?.content || ''}
              onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
            />
            <DialogActions>
              <Button variant="outlined" onClick={handleEditDialogClose}>
                Cancel
              </Button>
              <Button variant="outlined" type="submit" disabled={updateNews.isLoading}>
                {updateNews.isLoading ? 'Updating...' : 'Update'}
              </Button>
            </DialogActions>
          </form>
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
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
        <MenuItem onClick={() => handleEdit(popover.currentId)}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>
    </Container>
  );
}
