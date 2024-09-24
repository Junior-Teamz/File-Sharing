import { useContext, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/system/Unstable_Grid/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { useSettingsContext } from 'src/components/settings';
import { SeoIllustration } from 'src/assets/illustrations';
import AppWidgetSummary from '../app-widget-summary';
import AppWelcome from '../app-welcome';
import EmptyContent from 'src/components/empty-content';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Chip,
} from '@mui/material';
import { useDeleteFolder, useEditFolder, useFetchFolder, useMutationFolder } from './folders';
import imageFolder from '/assets/icons/files/ic_folder.svg';
import FileManagerPanel from 'src/sections/file-manager/file-manager-panel';
import { paths } from 'src/routes/paths';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import FileManagerNewFolderDialog from 'src/sections/file-manager/file-manager-new-folder-dialog';
import { _allFiles, _files, _folders } from 'src/_mock';
import { Box, Stack } from '@mui/system';
import FileRecentItem from 'src/sections/file-manager/file-recent-item';
import { Link } from 'react-router-dom';
import { AuthContext } from 'src/auth/context/jwt/auth-context';
import { useIndexTag } from 'src/sections/tag/view/TagMutation';

export default function OverviewAppView() {
  const { user } = useContext(AuthContext);
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const { data: tags = {}, isLoading: isLoadingTags, error: tagsError } = useIndexTag();
  const [editFolderId, setEditFolderId] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [tagsData, setTagsData] = useState([]);
  // const [tableData, setTableData] = useState(_allFiles);
  const [tagsInput, setTagsInput] = useState(''); // To handle input as a string
  const { mutate: CreateFolder, isPending } = useMutationFolder({
    onSuccess: () => {
      enqueueSnackbar('Folder Created Successfully');
      reset();
      refetch();
      handleClosed();
    },
    onError: (error) => {
      if (error.errors.description) {
        return enqueueSnackbar(`Gagal membuat folder: ${error.errors.tags}`, { variant: 'error' });
      }
    },
  });

  useEffect(() => {
    if (tags.data && Array.isArray(tags.data)) {
      setTagsData(tags.data);
    } else if (tagsError) {
      console.error('Error fetching tags:', tagsError);
    }
  }, [tags.data, tagsError]);

  const { mutate: deleteFolder, isPending: loadingDelete } = useDeleteFolder({
    onSuccess: () => {
      enqueueSnackbar('Folder Berhasil Dihapus', { variant: 'success' });
      setSelected([]); // Reset checkbox
      refetch();
      handleDeleteConfirmClose();
    },
    onError: (error) => {
      enqueueSnackbar(`Gagal menghapus folder: ${error.message}`, { variant: 'error' });
    },
  });

  const { mutate: editFolder, isPending: loadingEditFolder } = useEditFolder({
    onSuccess: () => {
      enqueueSnackbar('Folder Berhasil diupdate', { variant: 'success' });
      setSelected([]); // Reset checkbox
      refetch();
      handleEditDialogClose();
    },
    onError: (error) => {
      enqueueSnackbar(`Gagal update folder: ${error.message}`, { variant: 'error' });
    },
  });

  const { data, isLoading, refetch, isFetching } = useFetchFolder(); // Fetch Folder
  const { files } = data;
  console.log(files);

  if (isLoading || isFetching) {
    return (
      <Container maxWidth="xl">
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
          <CircularProgress />
        </Grid>
      </Container>
    );
  }
  const handleClickOpen = () => {
    reset();
    setOpen(true); // Untuk FileManagerNewFolderDialog
  };

  const handleClickOpened = () => {
    reset();
    setOpened(true); // Untuk dialog pembuatan folder lainnya
  };

  const handleClose = () => setOpen(false);
  const handleClosed = () => setOpened(false);
  const handleDeleteConfirmOpen = () => setDeleteConfirmOpen(true);
  const handleDeleteConfirmClose = () => setDeleteConfirmOpen(false);

  const handleEditDialogOpen = async (folderId, folderName, folderTags) => {
    setEditFolderId(folderId);
    setValue('name', folderName);
    setSelectedTags(folderTags); // Set selectedTags with the existing tags for the folder
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditFolderId(null);
  };

  const handleDeleteSelected = () => {
    selected.forEach((folderId) => {
      deleteFolder(folderId);
    });
    setSelected([]);
  };

  const handleEditSubmit = (data) => {
    // Ensure the folder name is valid
    if (!data.name || data.name.trim() === '') {
      enqueueSnackbar('Folder name is required', {
        variant: 'warning',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
      return;
    }

    // Prepare the data to send
    const folderData = {
      name: data.name,
      tag_ids: selectedTags, // Use tag_ids instead of tags
    };

    // Submit the form
    editFolder({ folderId: editFolderId, data: folderData });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const folders = Array.isArray(data?.folders) ? data.folders : [];
      setSelected(folders.map((folder) => folder.folder_id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (event, folderId) => {
    const selectedIndex = selected.indexOf(folderId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, folderId];
    } else {
      newSelected = selected.filter((id) => id !== folderId);
    }

    setSelected(newSelected);
  };

  const handleTagChange = (tags) => {
    setSelectedTags(tags); // Update the selected tags state
    console.log('Selected Tags:', tags);
  };


  const Onsubmit = (data) => {
    // Ensure the folder name is valid
    if (!data.name || data.name.trim() === '') {
      enqueueSnackbar('Folder name is required', {
        variant: 'warning',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
      return;
    }

    // Prepare the data to send
    const folderData = {
      name: data.name,
      tag_ids: selectedTags, // Use tag_ids instead of tags
    };

    // Submit the form
    CreateFolder(folderData);
    reset();
    setSelectedTags([]);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={14}>
          <AppWelcome title={`Welcome back 👋 ${user?.name}`} img={<SeoIllustration />} />
        </Grid>
        <Grid xs={12} md={12} lg={12}>
          <FileManagerPanel
            title="Folders"
            link={paths.dashboard.fileManager}
            onOpen={handleClickOpened}
            sx={{ mt: 5 }}
          />

          <Dialog open={opened} onClose={handleClosed}>
            <DialogTitle>Create Folder</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit(Onsubmit)}>
                <DialogContentText sx={{ mb: 3 }}>
                  Silahkan masukkan nama folder yang ingin dibuat disini.
                </DialogContentText>
                <Stack spacing={2}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    name="name"
                    label="Nama Folder"
                    type="text"
                    fullWidth
                    variant="outlined"
                    {...register('name')}
                  />
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="tags-label">Tags</InputLabel>
                    <Select
                      labelId="tags-label"
                      id="tags"
                      multiple
                      value={selectedTags}
                      onChange={(event) => handleTagChange(event)} // Kirim event langsung
                      input={<OutlinedInput id="select-multiple-chip" label="Tags" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.5,
                            maxHeight: 100,
                            overflowY: 'auto',
                          }}
                        >
                          {selected.map((tagId) => {
                            const tag = tagsData.find((t) => t.id === tagId);
                            return (
                              <Chip
                                key={tagId}
                                label={tag ? tag.name : `Tag ${tagId} not found`}
                                sx={{ mb: 0.5 }}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {isLoadingTags ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : tagsData.length > 0 ? (
                        tagsData.map((tag) => (
                          <MenuItem key={tag.id} value={tag.id}>
                            {tag.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No tags available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Stack>
                <DialogActions>
                  <Button variant="outlined" onClick={handleClosed}>
                    Cancel
                  </Button>
                  <Button variant="outlined" type="submit">
                    {isPending ? 'Creating...' : 'Create'}
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </Grid>

        {data.folders.length === 0 ? (
          <>
            <EmptyContent filled title="Folder Kosong" sx={{ py: 10 }} />
          </>
        ) : (
          <Grid xs={12} md={12} lg={12}>
            <Dialog open={opened} onClose={handleClosed}>
              <DialogTitle>Create Folder</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit(Onsubmit)}>
                  <DialogContentText sx={{ mb: 3 }}>
                    Silahkan masukkan nama folder yang ingin dibuat disini.
                  </DialogContentText>
                  <Stack spacing={2}>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      name="name"
                      label="Nama Folder"
                      type="text"
                      fullWidth
                      variant="outlined"
                      {...register('name')}
                    />
                    <FormControl fullWidth margin="dense">
                      <InputLabel id="tags-label">Tags</InputLabel>
                      <Select
                        labelId="tags-label"
                        id="tags"
                        multiple
                        value={selectedTags}
                        onChange={handleTagChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Tags" />}
                        renderValue={(selected) => (
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 0.5,
                              maxHeight: 100,
                              overflowY: 'auto',
                            }}
                          >
                            {selected.map((tagId) => {
                              const tag = tagsData.find((t) => t.id === tagId);
                              return (
                                <Chip
                                  key={tagId}
                                  label={tag ? tag.name : `Tag ${tagId} not found`}
                                  sx={{ mb: 0.5 }}
                                />
                              );
                            })}
                          </Box>
                        )}
                      >
                        {isLoadingTags ? (
                          <MenuItem disabled>Loading...</MenuItem>
                        ) : tagsData.length > 0 ? (
                          tagsData.map((tag) => (
                            <MenuItem key={tag.id} value={tag.id}>
                              {tag.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No tags available</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Stack>
                  <DialogActions>
                    <Button variant="outlined" onClick={handleClosed}>
                      Cancel
                    </Button>
                    <Button variant="outlined" type="submit">
                      {isPending ? 'Creating...' : 'Create'}
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
              <DialogContent>
                <form onSubmit={handleSubmit(handleEditSubmit)}>
                  <DialogContentText sx={{ mb: 3 }}>
                    Silahkan masukkan nama folder yang ingin diubah disini.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    name="name"
                    label="Nama Folder"
                    type="text"
                    fullWidth
                    variant="outlined"
                    {...register('name')}
                  />
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="tags-label">Tags</InputLabel>
                    <Select
                      multiple
                      labelId="tags-label"
                      id="tags"
                      value={selectedTags || []}
                      onChange={handleTagChange}
                      input={<OutlinedInput id="select-multiple-chip" label="Tags" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.5,
                            maxHeight: 100,
                            overflowY: 'auto',
                          }}
                        >
                          {selected.map((tagId) => {
                            const tag = tags.find((t) => t.id === tagId);
                            return (
                              <Chip
                                key={tagId}
                                label={tag ? tag.name : `Tag ${tagId} not found`}
                                sx={{ mb: 0.5 }}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {isLoadingTags ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : tags.length > 0 ? (
                        tags.map((tag) => (
                          <MenuItem key={tag.id} value={tag.id}>
                            {tag.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No tags available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <DialogActions>
                    <Button variant="outlined" onClick={handleEditDialogClose}>
                      Cancel
                    </Button>
                    <Button variant="outlined" type="submit">
                      {loadingEditFolder ? 'Editing' : 'Edit'}
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
              <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
              <DialogContent>
                <DialogContentText>Kamu yakin hapus folder-folder ini?</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteConfirmClose}>Batal</Button>
                <Button onClick={handleDeleteSelected} color="error">
                  {loadingDelete ? 'Deleting' : 'Delete'}
                </Button>
              </DialogActions>
            </Dialog>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {selected.length > 0 ? (
                      <>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selected.length > 0 && selected.length < data.length}
                            checked={data.length > 0 && selected.length === data.length}
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                        <TableCell colSpan={4}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="body1">{selected.length} selected</Typography>
                            <div>
                              <Tooltip
                                title={
                                  selected.length !== 1
                                    ? 'Silakan pilih satu folder untuk diedit'
                                    : ''
                                }
                              >
                                <span>
                                  <IconButton
                                    onClick={() =>
                                      handleEditDialogOpen(
                                        selected[0],
                                        data?.folders.find(
                                          (folder) => folder.folder_id === selected[0]
                                        )?.name
                                      )
                                    }
                                    disabled={selected.length !== 1}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <IconButton onClick={handleDeleteConfirmOpen}>
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selected.length > 0 && selected.length < data.length}
                            checked={data.length > 0 && selected.length === data.length}
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                        <TableCell>Number</TableCell>
                        <TableCell>Name</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.folders?.map((folder, idx) => (
                    <TableRow
                      key={folder.folder_id}
                      selected={selected.indexOf(folder.folder_id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.indexOf(folder.folder_id) !== -1}
                          onChange={(event) => handleSelectOne(event, folder.folder_id)}
                        />
                      </TableCell>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={imageFolder} alt="folder" />
                        {/* Bungkus hanya pada TableCell yang menampilkan nama */}
                        <Link
                          to={`file-manager/info/${folder.folder_id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {folder.name}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
        <Grid xs={12} md={12} lg={12} sx={{ mt: 10 }}>
          <FileManagerPanel
            title="Files"
            link={paths.dashboard.fileManager}
            onOpen={handleClickOpen}
            sx={{ mt: 5 }}
          />
          <FileManagerNewFolderDialog
            title="Upload Files"
            open={open} // Use the same state
            onClose={handleClose} // Ensure the dialog can close properly
            refetch={refetch} // Tambahkan refetch prop
            onTagChange={handleTagChange} // Ensure 'handleTagChange' is used here
          />

          <Stack spacing={2}>
            {files?.map((file) => (
              <FileRecentItem
                key={file.id}
                onRefetch={refetch} // Pass the refetch function here
                file={file}
                onDelete={() => console.info('DELETE', file.id)}
              />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
