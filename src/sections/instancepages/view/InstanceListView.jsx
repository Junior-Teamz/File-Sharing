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
import EmptyContent from 'src/components/empty-content';

export default function InstanceListView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, setValue } = useForm();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [popover, setPopover] = useState({ open: false, anchorEl: null, currentId: null });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); // New state for delete confirmation
  const [searchTerm, setSearchTerm] = useState('');

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
      handleEditDialogClose();
    },
    onError: (error) => {
      enqueueSnackbar(`Gagal memperbarui instansi: ${error.message}`, { variant: 'error' });
    },
  });

  const instances = data?.data || [];

  // Sort instances by creation date (most recent first)
  const sortedInstances = instances.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Filter instances based on search term
  const filteredInstances = sortedInstances.filter((instance) =>
    instance.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleDeleteOpen = (id) => {
    setPopover({ open: false, anchorEl: null, currentId: id });
    setDeleteConfirmOpen(true); // Open the confirmation dialog
  };

  const handleDelete = () => {
    const instansiId = popover.currentId;
    if (instansiId) {
      deleteInstansi(instansiId);
      setDeleteConfirmOpen(false); // Close the confirmation dialog
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
            { name: 'Daftar Instansi', href: paths.dashboard.instance.list },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.instance.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Buat Instansi
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {/* Search Input */}
        <TextField
          fullWidth
          placeholder="Cari berdasarkan nama..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        {isLoading || isFetching ? (
          <CircularProgress />
        ) : filteredInstances.length === 0 ? (
          <EmptyContent title="Tidak ada instansi ditemukan." />
        ) : (
          <Scrollbar>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Nomor</TableCell>
                    <TableCell>Nama</TableCell>
                    <TableCell>Alamat</TableCell>
                    <TableCell align="center">Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInstances
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((instance, idx) => (
                      <TableRow key={instance.id}>
                        <TableCell align="center">{idx + 1}</TableCell>
                        <TableCell>{instance.name}</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 250,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            paddingRight: 2,
                          }}
                        >
                          {instance.address}
                        </TableCell>
                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                          <Tooltip title="Aksi Lainnya" placement="top">
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
              count={filteredInstances.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Scrollbar>
        )}

        {/* Modal for editing instance */}
        <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
          <DialogTitle>Edit Instansi</DialogTitle>
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
                label="Nama Instansi"
                type="text"
                fullWidth
                variant="outlined"
                {...register('name')}
              />
              <TextField
                margin="dense"
                id="address"
                name="address"
                label="Alamat Instansi"
                type="text"
                fullWidth
                variant="outlined"
                {...register('address')}
              />
              <DialogActions>
                <Button variant="outlined" onClick={handleEditDialogClose}>
                  Batal
                </Button>
                <Button variant="outlined" type="submit">
                  {loadingEdit ? 'Mengedit' : 'Edit'}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog for Deletion */}
        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Apakah Anda yakin ingin menghapus instansi ini? Tindakan ini tidak dapat dibatalkan.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
              Batal
            </Button>
            <Button onClick={handleDelete} color="secondary" disabled={loadingDelete}>
              {loadingDelete ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogActions>
        </Dialog>

        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={handlePopoverClose}
          sx={{ mt: 1 }}
        >
          <MenuItem onClick={() => handleEdit(popover.currentId)}>
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>
          <MenuItem onClick={() => handleDeleteOpen(popover.currentId)}>
            <Iconify icon="eva:trash-2-outline" /> Hapus
          </MenuItem>
        </CustomPopover>
      </Container>
    </>
  );
}
