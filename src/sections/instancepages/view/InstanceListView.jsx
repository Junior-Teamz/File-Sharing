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
} from '@mui/material';
import { useState } from 'react';
import { useIndexInstance, useEditInstance, useDeleteInstance } from './Instance';
import { useSnackbar } from 'notistack';
import CustomPopover from 'src/components/custom-popover';
import { useForm } from 'react-hook-form';

export default function InstanceListView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, setValue } = useForm();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [popover, setPopover] = useState({ open: false, anchorEl: null, currentId: null });
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data, isLoading, isFetching, refetch } = useIndexInstance();
  const { mutate: deleteInstansi, isPending: loadingDelete } = useDeleteInstance({
    onSuccess: () => {
      enqueueSnackbar('Instansi Berhasil Dihapus', { variant: 'success' });
      refetch();
    },
    onError: (error) => {
      enqueueSnackbar(`Gagal menghapus instansi: ${error.message}`, { variant: 'error' });
    },
  });
  const { mutate: editInstansi, isPending: loadingEdit } = useEditInstance({
    onSuccess: () => {
      enqueueSnackbar('Instansi Berhasil Diperbarui', { variant: 'success' });
      refetch();
      onclose();
    },
    onError: (error) => {
      enqueueSnackbar(`Gagal memperbarui instansi: ${error.message}`, { variant: 'error' });
    },
  });

  const instances = data?.data || [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    const instanceToEdit = instances.find((inst) => inst.id === id);
    if (instanceToEdit) {
      setValue('name', instanceToEdit.name);

      setValue('address', instanceToEdit.address);
      setPopover((prev) => ({ ...prev, currentId: id }));
      setEditDialogOpen(true);
    } else {
      enqueueSnackbar('Instance tidak ditemukan', { variant: 'error' });
    }
  };

  const handleDelete = () => {
    const instansiId = popover.currentId;
    if (instansiId) {
      deleteInstansi(instansiId); // Pass only the ID, no additional data
      setPopover((prev) => ({ ...prev, open: false }));
    } else {
      enqueueSnackbar('ID tidak ditemukan untuk menghapus instance', { variant: 'error' });
    }
  };
  
  
  const handlePopoverOpen = (event, id) => {
    setPopover({ open: true, anchorEl: event.currentTarget, currentId: id });
  };
  
  const handlePopoverClose = () => {
    setPopover((prev) => ({ ...prev, open: false, currentId: null }));
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditSubmit = (data) => {
    if (popover.currentId) {
      editInstansi({ instansiId: popover.currentId, data });
      setEditDialogOpen(false);
    } else {
      enqueueSnackbar('ID tidak ditemukan untuk mengedit instance', { variant: 'error' });
    }
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Instance List', href: paths.dashboard.instance.list },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.instance.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Instance
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {isLoading || isFetching ? (
          <CircularProgress />
        ) : (
          <Scrollbar>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>

                    <TableCell>Address</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instances
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((instance) => (
                      <TableRow key={instance.id}>
                        <TableCell>{instance.name}</TableCell>

                        <TableCell sx={{ maxWidth: 200, padding: '0', whiteSpace: 'nowrap' }}>
                          <div
                            style={{ overflowX: 'auto', maxWidth: '100%', display: 'inline-block' }}
                          >
                            {instance.address}
                          </div>
                        </TableCell>

                        {/* <TableCell//ini titik  titik teks nya
                          sx={{
                            maxWidth: 200, // Tentukan batas lebar maksimum untuk kolom address
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {instance.address}
                        </TableCell> */}

                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          <Tooltip title="More Actions" placement="top">
                            <IconButton onClick={(event) => handlePopoverOpen(event, instance.id)}>
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
              count={instances.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Scrollbar>
        )}

        {/* Modal for editing instance */}
        <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
          <DialogTitle>Edit Instance</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleEditSubmit)}>
              <DialogContentText sx={{ mb: 3 }}>
                Silahkan masukkan data yang ingin diubah.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                name="name"
                label="Nama Instance"
                type="text"
                fullWidth
                variant="outlined"
                {...register('name')}
              />

              <TextField
                margin="dense"
                id="address"
                name="address"
                label="Address Instance"
                type="text"
                fullWidth
                variant="outlined"
                {...register('address')}
              />
              <DialogActions>
                <Button variant="outlined" onClick={handleEditDialogClose}>
                  Cancel
                </Button>
                <Button variant="outlined" type="submit">
                  {loadingEdit ? 'Editing' : 'Edit'}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <CustomPopover
          open={popover.open} // boolean for open
          anchorEl={popover.anchorEl} // element for anchorEl
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
    </>
  );
}
