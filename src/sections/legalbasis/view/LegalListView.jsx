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
import { useDeleteLegal, useEditLegal, useFetchLegal } from './fetchLegalBasis';

export default function LegalListView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, setValue } = useForm();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [popover, setPopover] = useState({ open: false, anchorEl: null, currentId: null });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // Fetch legal documents data
  const { data, isLoading, isFetching, refetch } = useFetchLegal();

  const { mutate: deleteLegal, isPending: loadingDelete } = useDeleteLegal({
    onSuccess: () => {
      enqueueSnackbar('Legal document successfully deleted', { variant: 'success' });
      refetch();
    },
    onError: (error) => {
      enqueueSnackbar(`Failed to delete document: ${error.message}`, { variant: 'error' });
    },
  });

  const { mutate: editLegal, isPending: loadingEdit } = useEditLegal({
    onSuccess: () => {
      enqueueSnackbar('Legal document successfully updated', { variant: 'success' });
      refetch();
      handleEditDialogClose();
    },
    onError: (error) => {
      enqueueSnackbar(`Failed to update document: ${error.message}`, { variant: 'error' });
    },
  });

  const documents = data?.data || [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    const documentToEdit = documents.find((doc) => doc.id === id);
    if (documentToEdit) {
      setValue('name', documentToEdit.name);
      setPopover((prev) => ({ ...prev, currentId: id }));
      setEditDialogOpen(true);
    } else {
      enqueueSnackbar('Document not found', { variant: 'error' });
    }
  };

  const handleDelete = (id) => {
    deleteLegal(id);
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
      editLegal({ documentId: popover.currentId, data });
      setEditDialogOpen(false);
    } else {
      enqueueSnackbar('ID not found for editing document', { variant: 'error' });
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = documents.map((doc) => doc.id);
      setSelectedDocuments(allIds);
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleSelectOne = (id) => {
    const selectedIndex = selectedDocuments.indexOf(id);
    let newSelectedDocuments = [];

    if (selectedIndex === -1) {
      newSelectedDocuments = newSelectedDocuments.concat(selectedDocuments, id);
    } else if (selectedIndex === 0) {
      newSelectedDocuments = newSelectedDocuments.concat(selectedDocuments.slice(1));
    } else if (selectedIndex === selectedDocuments.length - 1) {
      newSelectedDocuments = newSelectedDocuments.concat(selectedDocuments.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedDocuments = newSelectedDocuments.concat(
        selectedDocuments.slice(0, selectedIndex),
        selectedDocuments.slice(selectedIndex + 1)
      );
    }

    setSelectedDocuments(newSelectedDocuments);
  };

  const handleDeleteSelected = () => {
    selectedDocuments.forEach((id) => deleteLegal(id));
    setSelectedDocuments([]);
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

      {isLoading || isFetching ? (
        <CircularProgress />
      ) : (
        <>
          <Toolbar>
            {selectedDocuments.length > 0 ? (
              <Typography
                sx={{ flex: '1 1 100%' }}
                color="inherit"
                variant="subtitle1"
                component="div"
              >
                {selectedDocuments.length} selected
              </Typography>
            ) : null}
            {selectedDocuments.length > 0 && (
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
                        indeterminate={selectedDocuments.length > 0 && selectedDocuments.length < documents.length}
                        checked={documents.length > 0 && selectedDocuments.length === documents.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={selectedDocuments.indexOf(doc.id) !== -1}
                          onChange={() => handleSelectOne(doc.id)}
                        />
                      </TableCell>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Tooltip title="More Actions" placement="top">
                          <IconButton onClick={(event) => handlePopoverOpen(event, doc.id)}>
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
              count={documents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Scrollbar>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Legal Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To edit this document, please modify the name below and click save.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Document Name"
            fullWidth
            variant="outlined"
            {...register('name')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit(handleEditSubmit)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <CustomPopover
        open={popover.open}
        onClose={handlePopoverClose}
        anchorEl={popover.anchorEl}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            handlePopoverClose();
            handleEdit(popover.currentId);
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleDelete(popover.currentId)}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-minimalistic-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </Container>
  );
}
