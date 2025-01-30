import { useContext, useEffect, useState } from 'react';
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
import { FormProvider, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import FileManagerNewFolderDialog from 'src/sections/file-manager/file-manager-new-folder-dialog';
import { _allFiles, _files, _folders } from 'src/_mock';
import { Box, Stack } from '@mui/system';
import FileRecentItem from 'src/sections/file-manager/file-recent-item';
import { Link } from 'react-router-dom';
import { AuthContext } from 'src/auth/context/jwt/auth-context';
import { useIndexTag } from 'src/sections/tag/view/TagMutation';
import FileManagerFileDialog from 'src/sections/favorite/FileManagerFileDialog';

// theme
import { bgGradient } from 'src/theme/css';
import { alpha, useTheme } from '@mui/material/styles';
import { RHFAutocomplete } from 'src/components/hook-form';

export default function OverviewAppView() {
  const theme = useTheme();
  const methods = useForm();
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset, setValue } = methods;
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const { data: tags = {}, isLoading: isLoadingTags, error: tagsError } = useIndexTag();
  const [editFolderId, setEditFolderId] = useState(null);

  const [tagsData, setTagsData] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (tags.data && Array.isArray(tags.data)) {
      setTagsData(tags.data);
    } else {
      setTagsData([]);
    }
  }, [tags.data, tagsError]);

  const { mutate: deleteFolder, isPending: loadingDelete } = useDeleteFolder({
    onSuccess: () => {
      enqueueSnackbar('Folder berhasil dihapus', { variant: 'success' });
      setSelected([]);
      refetch();
      handleDeleteConfirmClose();
    },
    onError: (error) => {
      enqueueSnackbar(`Gagal menghapus folder: ${error.message}`, { variant: 'error' });
    },
  });

  const { mutate: editFolder, isPending: loadingEditFolder } = useEditFolder({
    onSuccess: () => {
      enqueueSnackbar('Folder berhasil diupdate', { variant: 'success' });
      setSelected([]);
      refetch();
      handleEditDialogClose();
    },
    onError: (error) => {
      enqueueSnackbar(`Gagal update folder: ${error.message}`, { variant: 'error' });
    },
  });

  const { data, isLoading, refetch, isFetching } = useFetchFolder();
  const files = data?.files || [];

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
    setOpen(true);
  };

  const handleClickOpened = () => {
    reset();
    setOpened(true);
  };

  const handleClose = () => setOpen(false);
  const handleClosed = () => setOpened(false);
  const handleDeleteConfirmOpen = () => setDeleteConfirmOpen(true);
  const handleDeleteConfirmClose = () => setDeleteConfirmOpen(false);

  const handleEditDialogOpen = (folderId, folderName, folderTags) => {
    setEditFolderId(folderId);
    setValue('name', folderName);
    setSelectedTags(folderTags);
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
    if (!data.name || data.name.trim() === '') {
      enqueueSnackbar('Nama folder harus di isi', {
        variant: 'warning',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
      return;
    }

    const validTags = Array.isArray(selectedTags)
      ? selectedTags.filter((tag) => tagsData.some((existingTag) => existingTag.id === tag.id))
      : [];

    const folderData = {
      name: data.name,
      tag_ids: validTags.map((tag) => tag.id),
    };

    editFolder({ folderId: editFolderId, data: folderData });
  };

  const handleTagChange = (event) => {
    const value = event.target.value;

    if (Array.isArray(value)) {
      const validTags = value.filter((tag) =>
        tagsData.some((existingTag) => existingTag.id === tag.id)
      );
      setSelectedTags(validTags);
    } else if (value && typeof value === 'object' && value.id) {
      const validTag = tagsData.find((existingTag) => existingTag.id === value.id);
      if (validTag) {
        setSelectedTags((prevTags) => [...prevTags, validTag]);
      }
    } else {
      console.error('Unexpected value type:', value);
    }
  };

  const handleSelectAll = (event) => {
    setSelected(event.target.checked ? files.map((file) => file.id) : []);
  };

  const handleSelectOne = (event, folderId) => {
    setSelected((prevSelected) =>
      prevSelected.includes(folderId)
        ? prevSelected.filter((id) => id !== folderId)
        : [...prevSelected, folderId]
    );
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          ...bgGradient({
            color: alpha(
              theme.palette.background.paper,
              theme.palette.mode === 'light' ? 0.8 : 0.8
            ),
            imgUrl: '/assets/background/overlay_3.jpg',
          }),
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          position: 'absolute',
          filter: 'blur(20px)',
          WebkitFilter: 'blur(20px)',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      />

      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid xs={12} md={14}>
            <AppWelcome title={`Selamat datang ${user?.name} 👋`} img={<SeoIllustration />} />
          </Grid>
          <Grid xs={12} md={12} lg={12}>
            <FileManagerPanel
              title="Folder"
              link={paths.dashboard.fileManager}
              onOpen={handleClickOpened}
              sx={{ mt: 5 }}
            />

            <FileManagerNewFolderDialog
              title="Buat Folder Baru "
              onTagChange={handleTagChange}
              open={opened}
              onClose={handleClosed}
            />
          </Grid>

          {data.subfolders?.length === 0 ? (
            <>
              <EmptyContent filled title="Folder Kosong" sx={{ py: 10 }} />
            </>
          ) : (
            <Grid xs={12} md={12} lg={12}>
              <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(handleEditSubmit)}>
                    <DialogTitle>Edit Folder</DialogTitle>

                    <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
                      <DialogContentText sx={{ mb: 3 }}>
                        Silahkan masukkan nama folder yang ingin diubah disini.
                      </DialogContentText>

                      <TextField
                        fullWidth
                        label="Nama Folder"
                        {...methods.register('name')}
                        required
                        margin="dense"
                      />

                      <FormControl fullWidth margin="dense">
                        <FormControl fullWidth margin="dense">
                          <RHFAutocomplete
                            name="tags"
                            label="Tags*"
                            multiple
                            options={tagsData}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            value={tagsData?.filter((tag) => selectedTags?.includes(tag.id))}
                            onChange={(_, value) => {
                              setSelectedTags(value.map((tag) => tag.id));
                            }}
                            renderTags={(value, getTagProps) => {
                              return value.map((option, index) => (
                                <Chip label={option.name} {...getTagProps({ index })} />
                              ));
                            }}
                            renderOption={(props, option) => (
                              <li {...props} key={option.id}>
                                {option.name}
                              </li>
                            )}
                            loading={isLoadingTags}
                          />
                        </FormControl>
                      </FormControl>
                    </DialogContent>

                    <DialogActions>
                      <Button variant="outlined" onClick={handleEditDialogClose}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loadingEditFolder || loadingEditFolder}
                      >
                        {loadingEditFolder ? 'Editing' : 'Edit'}
                      </Button>
                    </DialogActions>
                  </form>
                </FormProvider>
              </Dialog>

              <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
                <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                <DialogContent>
                  <DialogContentText>Kamu yakin hapus folder-folder ini?</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDeleteConfirmClose}>Batal</Button>
                  <Button onClick={handleDeleteSelected} color="error">
                    {loadingDelete ? 'Menghapus...' : 'Hapus'}
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
                              <Typography variant="body1">{selected.length} dipilih</Typography>
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
                                          data?.folders.find((folder) => folder.id === selected[0])
                                            ?.name
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
                          <TableCell>Nomor</TableCell>
                          <TableCell>Nama</TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.subfolders?.map((folder, idx) => (
                      <TableRow key={folder.id} selected={selected.indexOf(folder.id) !== -1}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected.includes(folder.id)}
                            onChange={(event) => handleSelectOne(event, folder.id)}
                            color="primary"
                          />
                        </TableCell>
                        <TableCell sx={{ alignItems: 'center' }}>{idx + 1}</TableCell>
                        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={imageFolder} alt="folder" />

                          <Link
                            to={`file-manager/info/${folder.id}`}
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
            <FileManagerFileDialog
              title="Upload File"
              open={open}
              onClose={handleClose}
              refetch={refetch}
            />

            <Stack spacing={2}>
              {files.length === 0 && (
                <>
                  <EmptyContent filled title="File Kosong" sx={{ py: 10 }} />
                </>
              )}
              {files?.map((file) => (
                <FileRecentItem
                  key={file.id}
                  onRefetch={refetch}
                  file={file}
                  onDelete={() => console.info('DELETE', file.id)}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
