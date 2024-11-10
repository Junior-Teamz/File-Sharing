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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  MenuItem,
  CircularProgress,
  Snackbar,
  Typography,
} from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomPopover from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { useDeleteLegal, useFetchLegal, useEditLegal } from './fetchLegalBasis';
import { useSnackbar } from 'notistack';

export default function LegalListView() {
  const settings = useSettingsContext();
  const { data: legalDocuments, refetch, isLoading } = useFetchLegal();
  const deleteLegal = useDeleteLegal();
  const { mutateAsync: editLegal, isLoading: isUpdating } = useEditLegal();
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [popover, setPopover] = useState({ open: false, anchorEl: null, currentId: null });
  const [editingDocument, setEditingDocument] = useState({});

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const [viewPdfOpen, setViewPdfOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null); // Simpan dokumen yang akan dihapus

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const confirmDelete = (id) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true); // Buka dialog konfirmasi delete
  };

  const handleDelete = () => {
    deleteLegal.mutate(documentToDelete, {
      onSuccess: () => {
        enqueueSnackbar('Dasar hukum berhasil dihapus', { variant: 'success' });
        refetch();
        setDeleteDialogOpen(false); // Tutup dialog setelah sukses
      },
      onError: (error) => {
        enqueueSnackbar(`Gagal menghapus dasar hukum: ${error.message}`, { variant: 'error' });
      },
    });
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false); // Tutup dialog tanpa menghapus
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingDocument(null);
    setFile(null);
    setFileError('');
  };

  const handleViewPdfOpen = () => {
    setViewPdfOpen(true);
  };

  const handleViewPdfClose = () => {
    setViewPdfOpen(false);
  };

  const handleEdit = (doc) => {
    setEditingDocument(doc);
    setEditDialogOpen(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validasi tipe file
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setFileError('File harus berupa PDF, DOCX, atau DOC');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setFileError(''); // Hapus error jika file dipilih
      setEditingDocument((prev) => ({
        ...prev,
        file: selectedFile,
        file_name: selectedFile.name, // Memperbarui nama file
      })); // Memperbarui state dengan file baru
    }
  };

  const handleNameChange = (e) => {
    setEditingDocument({ ...editingDocument, name: e.target.value });
  };

  const handleEditAction = async () => {
    // Validasi ID dokumen
    if (!editingDocument || !editingDocument.id) {
      enqueueSnackbar('ID dokumen hukum diperlukan!', { variant: 'error' });
      return;
    }

    const { id, name, file_url, file_name } = editingDocument;

    try {
      const updateData = {
        name: name || undefined,
        file_name: file_name ? file.name : editingDocument.file_name, // Gunakan nama file baru jika ada, jika tidak, gunakan yang lama
        file_url: file_url ? file.file_url : editingDocument.file_url, // Gunakan URL yang ada terlebih dahulu
      };

      await editLegal({ id: id, data: updateData });
      enqueueSnackbar('Dokumen berhasil diperbarui', { variant: 'success' });
      refetch();
      handleEditDialogClose();
    } catch (error) {
      enqueueSnackbar('Gagal memperbarui dokumen', { variant: 'error' });
    }
  };

  // Filter and sort documents
  const filteredDocuments = legalDocuments?.data
    ?.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by creation date (latest first)

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Daftar dasar hukum"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Daftar dasar hukum', href: paths.dashboard.legal.list },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.legal.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Buat dasar hukum baru
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
      />

      {isLoading ? (
        <CircularProgress />
      ) : filteredDocuments?.length > 0 ? (
        <Scrollbar>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>File</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          handleViewPdfOpen();
                          setEditingDocument(doc);
                        }}
                      >
                        View File
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="More Actions" placement="top">
                        <IconButton
                          onClick={(event) => {
                            setPopover({
                              open: true,
                              anchorEl: event.currentTarget,
                              currentId: doc.id,
                            });
                          }}
                        >
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
            count={filteredDocuments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Scrollbar>
      ) : (
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6">Tidak ada dokumen ditemukan</Typography>
        </Paper>
      )}

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Dokumen Hukum</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Untuk mengedit dokumen ini, silakan masukkan detail baru.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Nama Dokumen"
            type="text"
            fullWidth
            variant="standard"
            value={editingDocument?.name || ''}
            onChange={handleNameChange}
          />
          <TextField
            margin="dense"
            type="file"
            fullWidth
            error={Boolean(fileError)}
            helperText={fileError}
            onChange={handleFileChange}
          />

          {/* Menampilkan nama file yang sedang digunakan */}
          {editingDocument && editingDocument.file_name && !file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              File saat ini: {editingDocument.file_name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditAction} color="primary" disabled={isUpdating}>
            {isUpdating ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF View Dialog */}
      <Dialog open={viewPdfOpen} onClose={handleViewPdfClose} maxWidth="md" fullWidth>
        <DialogTitle>Document PDF</DialogTitle>
        <DialogContent>
          <iframe
            src={editingDocument?.file_url}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
            title="PDF Document"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewPdfClose} color="primary">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>

      <CustomPopover
        open={popover.open}
        onClose={() => setPopover({ ...popover, open: false })}
        anchorEl={popover.anchorEl}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            const documentToEdit = legalDocuments.data.find((doc) => doc.id === popover.currentId);
            handleEdit(documentToEdit);
            setPopover({ ...popover, open: false });
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => confirmDelete(popover.currentId)} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-minimalistic-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Konfirmasi Hapus'}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Apakah kamu yakin ingin menghapus dasar hukum ini? 
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
