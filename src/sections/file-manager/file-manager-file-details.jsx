import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Drawer from '@mui/material/Drawer';
// utils
import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import EditIcon from '@mui/icons-material/Edit';
import Scrollbar from 'src/components/scrollbar';
import FileThumbnail, { fileFormat } from 'src/components/file-thumbnail';
import FileManagerShareDialog from './file-manager-share-dialog';
import FileManagerInvitedItem from './file-manager-invited-item';
import {
  useAddFileTag,
  useRemoveTagFile,
  useMutationDeleteFiles,
  useChangeNameFile,
  useDownloadFile,
} from './view/folderDetail/index';
import { useIndexTag } from '../tag/view/TagMutation';
import { useSnackbar } from 'notistack';
import { Dialog, DialogActions, DialogContent, DialogTitle, Modal, Tooltip } from '@mui/material';
import { useAddFavorite, useRemoveFavorite } from './view/favoritemutation';
import { useQueryClient } from '@tanstack/react-query';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';

// ----------------------------------------------------------------------

export default function FIleManagerFileDetails({
  item,
  open,
  favorited,
  onFavorite,
  onCopyLink,
  onClose,
  onDelete,
  ...other
}) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    name,
    size,
    image_url,
    id,
    type,
    shared,
    shared_with,
    modified_at,
    email,
    video_url,
    user,
    instance,
    tags: initialTags,
    updated_at,
    created_at,
    is_favorite,
    file_url,
  } = item;

  const isFolder = item.type === 'folder';

  const [isOpen, setIsOpen] = useState(false);
  const [newFileName, setNewFileName] = useState(item.name);
  const [originalFileType, setOriginalFileType] = useState(item.type);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const { mutateAsync: updateNameFile } = useChangeNameFile();
  const { mutateAsync: addFavorite } = useAddFavorite();
  const { mutateAsync: removeFavorite } = useRemoveFavorite();
  const [tags, setTags] = useState(initialTags.map((tag) => tag.id));
  const [availableTags, setAvailableTags] = useState([]);
  const queryClient = useQueryClient();
  const toggleTags = useBoolean(true);
  const share = useBoolean();
  const properties = useBoolean(true);
  const [fileIdToDelete, setFileIdToDelete] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const favorite = useBoolean(is_favorite);
  const [issLoading, setIsLoading] = useState(false);
  const { mutateAsync: downloadFile } = useDownloadFile();
  const { data: tagData, isLoading, isError } = useIndexTag();
  const addTagFile = useAddFileTag();
  const { mutateAsync: removeTagFile } = useRemoveTagFile();
  const { mutateAsync: deleteFile } = useMutationDeleteFiles();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setNewFileName(item.name);
    setOriginalFileType(item.type);
  }, [item]);

  useEffect(() => {
    if (!isLoading && !isError && tagData && Array.isArray(tagData.data)) {
      setAvailableTags(tagData.data);
    } else if (isError) {
      console.error('Error fetching tag data:', isError);
    }
  }, [tagData, isLoading, isError]);

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleChangeTags = useCallback((event, newValue) => {
    if (Array.isArray(newValue)) {
      setTags(newValue.map((tag) => tag.id));
    }
  }, []);

  const handleOpenConfirmDialog = (fileId) => {
    setFileIdToDelete(fileId);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setFileIdToDelete(null);
  };

  const handleRename = useCallback(async () => {
    const newFileType = newFileName.split('.').pop();

    if (newFileType !== originalFileType.split('.').pop()) {
      enqueueSnackbar('Type file tidak boleh diubah!', { variant: 'error' });
      return;
    }

    try {
      await updateNameFile({ fileId: item.id, data: { name: newFileName } });
      enqueueSnackbar('Nama file berhasil diperbarui!', { variant: 'success' });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['folder.admin'] });
      queryClient.invalidateQueries({ queryKey: ['folder.detail'] });
    } catch (error) {
      enqueueSnackbar('Gagal memperbarui nama file!', { variant: 'error' });
    }
  }, [item.id, newFileName, originalFileType, updateNameFile, enqueueSnackbar, queryClient]);

  const handleDownload = useCallback(async () => {
    try {
      const idsToDownload = Array.isArray(item.ids) && item.ids.length ? item.ids : [item.id];

      const response = await downloadFile(idsToDownload);

      if (response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', item.name || 'download');
        document.body.appendChild(link);
        link.click();
        link.remove();
        enqueueSnackbar('Download berhasil!', { variant: 'success' });
      } else {
        enqueueSnackbar('Tidak ada data untuk di download!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Download error:', error);
      const errorMessage = error.response?.data?.error || 'Download gagal!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [downloadFile, item, enqueueSnackbar]);

  const handleSaveTags = async () => {
    try {
      const existingTagIds = new Set(initialTags.map((tag) => tag.id));
      const newTagIds = tags.filter((tagId) => !existingTagIds.has(tagId));

      if (newTagIds.length > 0) {
        for (const tagId of newTagIds) {
          await addTagFile.mutateAsync({
            file_id: item.id,
            tag_id: tagId,
          });
        }
        enqueueSnackbar('Tag berhasil ditambahkan!', { variant: 'success' });
        queryClient.invalidateQueries({ queryKey: ['folder.admin'] });
      } else {
        enqueueSnackbar('Tidak ada tag baru untuk ditambahkan.', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error adding tags:', error);
      if (error.response && error.response.data.errors) {
        if (error.response.data.errors.tag_id) {
          enqueueSnackbar('Tag sudah ada di file.', { variant: 'warning' });
        }
      }
      enqueueSnackbar('Error saat menambahkan tag', { variant: 'error' });
    }
  };

  const handleDeleteFile = async () => {
    try {
      await deleteFile(fileIdToDelete);
      enqueueSnackbar('File berhasil dihapus!', { variant: 'success' });
      handleCloseConfirmDialog();
      onDelete();
      queryClient.invalidateQueries({ queryKey: ['folder.admin'] });
    } catch (error) {
      console.error('Error deleting file:', error);
      enqueueSnackbar('Gagal menghapus file', { variant: 'error' });
    }
  };

  const handleRemoveTag = async (tagId) => {
    if (tags.length <= 1) {
      enqueueSnackbar('Kamu harus menyisakan satu tag', { variant: 'warning' });
      return;
    }

    try {
      await removeTagFile({ file_id: item.id, tag_id: tagId });
      setTags((prevTags) => prevTags.filter((id) => id !== tagId));
      enqueueSnackbar('Tag berhasil dihapus!', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['folder.admin'] });
    } catch (error) {
      console.error('Error removing tag:', error);
      enqueueSnackbar('Error removing tag.', { variant: 'error' });
    }
  };

  const handleCopyLink = () => {
    const fileUrl = item.id;

    if (!fileUrl) {
      enqueueSnackbar('No URL to copy.', { variant: 'warning' });
      return;
    }

    navigator.clipboard
      .writeText(fileUrl)
      .then(() => enqueueSnackbar('Link copied to clipboard!', { variant: 'success' }))
      .catch((err) => {
        console.error('Failed to copy link:', err);
        enqueueSnackbar('Failed to copy link.', { variant: 'error' });
      });
  };

  useEffect(() => {
    favorite.setValue(is_favorite);
  }, [is_favorite]);

  const handleFavoriteToggle = useCallback(async () => {
    setIsLoading(true);

    try {
      if (favorite.value) {
        await removeFavorite({ file_id: id });
        enqueueSnackbar('File berhasil dihapus dari favorite!', { variant: 'success' });
        queryClient.invalidateQueries({ queryKey: ['folder.admin'] });
      } else {
        // Tambahkan ke favorit
        await addFavorite({ file_id: id });
        enqueueSnackbar('File berhasil ditambahkan ke favorite', { variant: 'success' });
        queryClient.invalidateQueries({ queryKey: ['folder.admin'] });
      }

      favorite.onToggle();
    } catch (error) {
      if (error.response && error.response.data.errors && error.response.data.errors.file_id) {
        enqueueSnackbar('file id harus di isi.', { variant: 'error' });
      } else {
        enqueueSnackbar('Error saat menambahkan favorite!', { variant: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [favorite.value, id, addFavorite, removeFavorite, enqueueSnackbar]);

  const [isConfirmOpenn, setConfirmOpenn] = useState(false);

  const openConfirmDialogg = () => {
    setConfirmOpenn(true);
  };

  const closeConfirmDialogg = () => {
    setConfirmOpenn(false);
  };

  const renderTags = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Tag
      </Stack>

      {toggleTags.value && (
        <Autocomplete
          multiple
          options={availableTags}
          getOptionLabel={(option) => option.name}
          value={availableTags.filter((tag) => tags.includes(tag.id))}
          onChange={handleChangeTags}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                size="small"
                variant="soft"
                label={option.name}
                key={option.id}
                onDelete={() => handleRemoveTag(option.id)}
              />
            ))
          }
          renderInput={(params) => <TextField {...params} placeholder="Tambahkan tag" />}
        />
      )}
      <Button onClick={handleSaveTags}>simpan tag</Button>
    </Stack>
  );

  const renderProperties = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Properti
        <IconButton size="small" onClick={properties.onToggle}>
          <Iconify
            icon={properties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {properties.value && (
        <>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Ukuran
            </Box>
            {fData(size)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Dibuat
            </Box>
            {fDateTime(created_at)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Diperbarui
            </Box>
            {fDateTime(updated_at)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Tipe
            </Box>
            {fileFormat(type)}
          </Stack>
        </>
      )}
    </Stack>
  );

  const renderShared = (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
        <Typography variant="subtitle2"> File dibagikan dengan </Typography>

        <IconButton
          size="small"
          color="primary"
          onClick={share.onTrue}
          sx={{
            width: 24,
            height: 24,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <Iconify icon="mingcute:add-line" />
        </IconButton>
      </Stack>

      {shared_with.length > 0 ? (
        shared_with.map((share) => (
          <FileManagerInvitedItem
            key={share.user.id}
            user={share.user}
            permissions={share.permissions}
          />
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          Tidak dibagikan kepada siapa pun.
        </Typography>
      )}
    </>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: { width: 320 },
      }}
      {...other}
    >
      <Scrollbar sx={{ height: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6"> Info </Typography>

          <Checkbox
            color="warning"
            icon={<Iconify icon="eva:star-outline" />}
            checkedIcon={<Iconify icon="eva:star-fill" />}
            checked={favorite.value}
            onChange={handleFavoriteToggle}
          />
        </Stack>
        <Stack
          spacing={2.5}
          justifyContent="center"
          sx={{
            p: 2.5,
            bgcolor: 'background.neutral',
          }}
        >
          {isFolder ? (
            <Box
              sx={{
                width: 50,
                height: 40,
                flexShrink: 0,
                objectFit: 'cover',
              }}
              component="img"
              src="/assets/icons/files/ic_folder.svg"
              alt="Folder Icon"
            />
          ) : ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg'].includes(item.type) ? (
            <>
              <Box
                sx={{
                  position: 'relative',
                  cursor: 'zoom-in',
                  '&:hover .zoom-icon': {
                    opacity: 1,
                  },
                }}
              >
                <Box
                  component="img"
                  src={file_url}
                  alt={item.name}
                  onClick={handleOpen}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    cursor: 'zoom-in',
                  }}
                />
                <IconButton
                  className="zoom-icon"
                  sx={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: 'white',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                  }}
                  onClick={handleOpen}
                >
                  <ZoomInMapIcon />
                </IconButton>
              </Box>

              <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="zoomed-image-modal"
                aria-describedby="modal-with-zoomed-image"
              >
                <Box
                  position="relative"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100vh"
                  bgcolor="rgba(0, 0, 0, 0.8)"
                  onClick={handleClose}
                >
                  <Box
                    component="img"
                    src={file_url}
                    alt={item.name}
                    style={{
                      maxWidth: '50%',
                      maxHeight: '50%',
                      transform: 'scale(1.5)',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />

                  <IconButton
                    onClick={handleClose}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      color: '#fff',
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Modal>
            </>
          ) : [
              'mp4',
              'webm',
              '.mov',
              'mpeg1',
              'mpeg2',
              'mpeg4',
              'mpg',
              'avi',
              'wmv',
              'mpegps',
              'flv',
              '3gpp',
              'webm',
              'dnxhr',
              'prores',
              'cineform',
              'hevc',
            ].includes(item.type) ? (
            <video controls style={{ maxWidth: '100%', height: 'auto' }}>
              <source src={video_url} type={`video/${item.type}`} />
              Browser Anda tidak mendukung tag video.
            </video>
          ) : ['mkv'].includes(item.type) ? (
            <video controls style={{ maxWidth: '100%', height: 'auto' }}>
              <source src={file_url} />
              Browser Anda tidak mendukung tag video.
            </video>
          ) : ['aif', 'mp3', 'wav', 'ogg', 'm4p', 'mxp4', 'msv', 'aac'].includes(item.type) ? (
            <Box component="div">
              <audio controls>
                <source src={file_url} type={`audio/${item.type}`} />
                browser Anda tidak mendukung tag audio.
              </audio>
            </Box>
          ) : (
            <Button variant="contained" onClick={openConfirmDialogg} sx={{ mt: 2 }}>
              Download File
            </Button>
          )}

          {isEditing ? (
            <TextField
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename();
                }
              }}
              size="small"
              autoFocus
            />
          ) : (
            <Typography variant="subtitle2">
              {name}
              <Tooltip title="Edit nama file">
                <IconButton size="small" onClick={() => setIsEditing(true)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            {fData(size)}
          </Typography>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {renderTags}

          <Divider sx={{ borderStyle: 'dashed' }} />

          {renderProperties}

          <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" sx={{ typography: 'subtitle2' }}>
              Owner
            </Stack>
            <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
              <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                Nama
              </Box>
              {user?.name}
            </Stack>
            <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
              <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                Email
              </Box>
              {user?.email}
            </Stack>

            <Stack direction="row" alignItems="center" sx={{ typography: 'subtitle2' }}>
              Instansi
            </Stack>
            {item?.instances && item.instances.length > 0 ? (
              item.instances.map((instanceItem) => (
                <Stack
                  direction="row"
                  key={instanceItem.id}
                  sx={{ typography: 'caption', textTransform: 'capitalize' }}
                >
                  <Box component="span" sx={{ width: 50, color: 'text.secondary', mr: 2 }}>
                    {instanceItem?.name}
                  </Box>
                </Stack>
              ))
            ) : (
              <Typography>Tidak ada instansi</Typography>
            )}
          </Stack>

          <FileManagerShareDialog
            open={share.value}
            fileId={id}
            shared={shared_with}
            inviteEmail={inviteEmail}
            onChangeInvite={handleChangeInvite}
            onCopyLink={handleCopyLink}
            onClose={() => {
              share.onFalse();
              setInviteEmail('');
            }}
          />

          {renderShared}

          <Button fullWidth size="small" color="inherit" variant="outlined" onClick={onClose}>
            Tutup
          </Button>

          <Box sx={{ p: 2.5 }}>
            <Button
              fullWidth
              variant="soft"
              color="error"
              size="large"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => handleOpenConfirmDialog(item.id)}
            >
              Hapus
            </Button>
          </Box>
        </Stack>
      </Scrollbar>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography>Apakah Anda yakin ingin menghapus file ini?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Batal
          </Button>
          <Button onClick={handleDeleteFile} color="error" variant="contained">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isConfirmOpenn} onClose={closeConfirmDialogg}>
        <DialogTitle>Konfirmasi Download</DialogTitle>
        <DialogContent>Apakah Anda yakin ingin mendownload file ini?</DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialogg} color="error">
            Batal
          </Button>
          <Button onClick={handleDownload} color="primary" variant="contained">
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}

FIleManagerFileDetails.propTypes = {
  item: PropTypes.object,
  open: PropTypes.bool,
  favorited: PropTypes.bool,
  onFavorite: PropTypes.func,
  onCopyLink: PropTypes.func,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};
