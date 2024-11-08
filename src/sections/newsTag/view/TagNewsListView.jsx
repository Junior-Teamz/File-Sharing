import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSettingsContext } from 'src/components/settings';
import Container from '@mui/material/Container';
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Checkbox,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import CustomPopover from 'src/components/custom-popover';
import { useForm } from 'react-hook-form';
import { useFetchTagNews, useDeleteTagNews, useUpdateTagNews } from './fetchNewsTag';
import EmptyContent from 'src/components/empty-content';

export default function TagNewsListView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, setValue } = useForm();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [popover, setPopover] = useState({ open: false, anchorEl: null, currentId: null });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch tag data
  const { data, isLoading, isError, isFetching, refetch } = useFetchTagNews();

  const { mutate: deleteTag, isPending: loadingDelete } = useDeleteTagNews({
    onSuccess: () => {
      enqueueSnackbar('Tag Berhasil Dihapus', { variant: 'success' });
      refetch();
    },
    onError: (error) => {
      enqueueSnackbar(`Gagal menghapus tag: ${error.message}`, { variant: 'error' });
    },
  });

  const { mutate: editTag, isPending: loadingEdit } = useUpdateTagNews({
    onSuccess: () => {
      enqueueSnackbar('Tag Berhasil Diperbarui', { variant: 'success' });
      refetch();
      handleEditDialogClose();
    },
    onError: (error) => {
      enqueueSnackbar(`Gagal memperbarui tag: ${error.message}`, { variant: 'error' });
    },
  });

  const tags = Array.isArray(data?.data) ? data?.data : [];


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    const tagToEdit = tags.find((tag) => tag.id === id);
    if (tagToEdit) {
      setValue('name', tagToEdit.name);
      setPopover((prev) => ({ ...prev, currentId: id }));
      setEditDialogOpen(true);
    } else {
      enqueueSnackbar('Tag tidak ditemukan', { variant: 'error' });
    }
  };

  const handleDelete = (id) => {
    deleteTag(id);
    setPopover((prev) => ({ ...prev, open: false }));
  };

  const handlePopoverOpen = (event, id) => {
    setPopover({ open: true, anchorEl: event.currentTarget, currentId: id });
  };

  const handlePopoverClose = () => {
    setPopover({ ...popover, open: false });
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditSubmit = (data) => {
    if (popover.currentId) {
      editTag({ newstagId: popover.currentId, data });
      setEditDialogOpen(false);
    } else {
      enqueueSnackbar('ID tidak ditemukan untuk mengedit tag', { variant: 'error' });
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = tags.map((tag) => tag.id);
      setSelectedTags(allIds);
    } else {
      setSelectedTags([]);
    }
  };

  const handleSelectOne = (id) => {
    const selectedIndex = selectedTags.indexOf(id);
    let newSelectedTags = [];

    if (selectedIndex === -1) {
      newSelectedTags = newSelectedTags.concat(selectedTags, id);
    } else if (selectedIndex === 0) {
      newSelectedTags = newSelectedTags.concat(selectedTags.slice(1));
    } else if (selectedIndex === selectedTags.length - 1) {
      newSelectedTags = newSelectedTags.concat(selectedTags.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedTags = newSelectedTags.concat(
        selectedTags.slice(0, selectedIndex),
        selectedTags.slice(selectedIndex + 1)
      );
    }

    setSelectedTags(newSelectedTags);
  };

  const handleDeleteSelected = () => {
    selectedTags.forEach((id) => deleteTag(id));
    setSelectedTags([]);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="News List Tag"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'News List Tag', href: paths.dashboard.TagNews.list },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.TagNews.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Create New Tag
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading || isFetching ? (
        <CircularProgress />
      ) : isError ? (
        <Typography color="error">Gagal memuat data</Typography>
      ) : tags.length === 0 ? (
        <EmptyContent
          filled
          title="Tidak ada tag berita"
          sx={{
            py: 10,
          }}
        />
      ) : (
        <>
          <Toolbar>
            {selectedTags.length > 0 ? (
              <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">
                {selectedTags.length} selected
              </Typography>
            ) : null}
            {selectedTags.length > 0 && (
              <Button variant="contained" color="error" onClick={handleDeleteSelected}>
                Delete Selected
              </Button>
            )}
          </Toolbar>

          <Scrollbar>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={selectedTags.length > 0 && selectedTags.length < tags.length}
                        checked={tags.length > 0 && selectedTags.length === tags.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tags.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={selectedTags.indexOf(tag.id) !== -1}
                          onChange={() => handleSelectOne(tag.id)}
                        />
                      </TableCell>
                      <TableCell>{tag.name}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="More Actions" placement="top">
                          <IconButton onClick={(event) => handlePopoverOpen(event, tag.id)}>
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tags.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Scrollbar>
        </>
      )}

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={handlePopoverClose}>
        <MenuItem onClick={() => handleEdit(popover.currentId)}>
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelete(popover.currentId)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </CustomPopover>

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Tag</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the tag name below:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Tag Name"
            type="text"
            fullWidth
            variant="standard"
            {...register('name')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit(handleEditSubmit)}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
