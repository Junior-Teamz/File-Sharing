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
  const [editingDocument, setEditingDocument] = useState(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [viewPdfOpen, setViewPdfOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id) => {
    deleteLegal.mutate(id, {
      onSuccess: () => {
        enqueueSnackbar('Dasar hukum berhasil dihapus', { variant: 'success' });
        refetch(); // Refetch documents after deletion
      },
      onError: (error) => {
        enqueueSnackbar(`Gagal menghapus dasar hukum: ${error.message}`, { variant: 'error' });
      },
    });
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

  const handleEdit = (document) => {
    setEditingDocument(document);
    setEditDialogOpen(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileError(''); // Clear error if a file is selected
      setEditingDocument({ ...editingDocument, file: selectedFile }); // Update state with the new file
    }
  };

  const handleNameChange = (e) => {
    setEditingDocument({ ...editingDocument, name: e.target.value });
  };

  const onSubmit = async () => {
    try {
      // Ensure the file and name are present in editingDocument
      const updatedDocument = {
        ...editingDocument,
        file: file ? file : editingDocument.file,
        name: name ? name : editingDocument.name,
      };

      await editLegal(updatedDocument); // Send the updated data
      enqueueSnackbar('Dasar hukum berhasil di perbarui', { variant: 'success' });
      handleEditDialogClose();
      refetch(); // Refetch documents after update
    } catch (error) {
      enqueueSnackbar(`Gagal memperbarui dasar hukum: ${error.message}`, { variant: 'error' });
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Legal Documents"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Legal Documents', href: paths.dashboard.legal.list },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.legal.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Document
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading ? (
        <CircularProgress />
      ) : (
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
                {legalDocuments?.data.map((doc) => (
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
            count={legalDocuments?.total || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Scrollbar>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Legal Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To edit this document, please enter the new details.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Document Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={editingDocument?.name}
            onChange={handleNameChange} // Update name change handling
          />
          <TextField
            margin="dense"
            label="Upload File"
            type="file"
            fullWidth
            error={Boolean(fileError)}
            helperText={fileError}
            onChange={handleFileChange} // Update file change handling
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary" disabled={isUpdating}>
            {isUpdating ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={viewPdfOpen} onClose={handleViewPdfClose} maxWidth="md" fullWidth>
        <DialogTitle>View PDF Document</DialogTitle>
        <DialogContent>
          <iframe
            src={editingDocument?.file_url}
            width="100%"
            height="500px"
            title="PDF Document"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewPdfClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popover for Actions */}
      <CustomPopover
        open={popover.open}
        onClose={() => setPopover({ ...popover, open: false })}
        anchorEl={popover.anchorEl}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            handleEdit(legalDocuments.data.find((doc) => doc.id === popover.currentId));
            setPopover({ ...popover, open: false });
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelete(popover.currentId)} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-minimalistic-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </Container>
  );
}
