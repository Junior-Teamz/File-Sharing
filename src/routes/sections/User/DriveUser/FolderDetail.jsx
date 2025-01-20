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
import Scrollbar from 'src/components/scrollbar';
import FileThumbnail, { fileFormat } from 'src/components/file-thumbnail';
import FileManagerShareDialog from './FileManagerShareDialog';
import FileManagerInvitedItem from './FileManagerInvitedItem';

import { useIndexTag } from './view/TagUser/useIndexTag';
import { useSnackbar } from 'notistack';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import {
  useAddTagFolder,
  useAddFavoriteFolder,
  useDeleteFolder,
  useRemoveFavoriteFolder,
  useRemoveTagFolder,
} from './view/Folder';
import FileManagerShareDialogFolder from './FileManagerShareDialogFolder';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export default function FolderDetail({
  item = {},
  open,
  favorited,
  onFavorite,
  onCopyLink,
  onClose,
  onDelete,
  ...other
}) {
  const {
    name,
    total_size,
    image_url,
    type,
    shared,
    shared_with = [],
    modifiedAt,
    email,
    user,
    id,
    folder_id,
    instance,
    created_at,
    tags: initialTags = [],
    updated_at,
    is_favorite,
  } = item;
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: addFavorite } = useAddFavoriteFolder();
  const { mutateAsync: removeFavorite } = useRemoveFavoriteFolder();
  const useClient = useQueryClient();
  const [tags, setTags] = useState(initialTags.map((tag) => tag.id));
  const [availableTags, setAvailableTags] = useState([]);
  const toggleTags = useBoolean(true);
  const share = useBoolean();
  const properties = useBoolean(true);
  const [folderIdToDelete, setFolderIdToDelete] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const favorite = useBoolean(is_favorite);
  const [issLoading, setIsLoading] = useState(false);
  const { data: tagData, isLoading, isError } = useIndexTag();
  const addTagFolder = useAddTagFolder();
  const { mutateAsync: removeTagFolder } = useRemoveTagFolder();
  const { mutateAsync: deleteFolder } = useDeleteFolder();

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

  const handleOpenConfirmDialog = (folderId) => {
    setFolderIdToDelete(folderId);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setFolderIdToDelete(null);
  };

  const handleSaveTags = async () => {
    if (!addTagFolder.mutateAsync) {
      console.error('addTagFile.mutateAsync is not a function');
      return;
    }

    try {
      const existingTagIds = new Set(initialTags.map((tag) => tag.id));
      const newTagIds = tags.filter((tagId) => !existingTagIds.has(tagId));

      if (newTagIds.length > 0) {
        for (const tagId of newTagIds) {
          await addTagFolder.mutateAsync({
            id: id,
            tag_id: tagId,
          });
        }
        enqueueSnackbar('Tag berhasil ditambahkan!', { variant: 'success' });
        useClient.invalidateQueries({ queryKey: ['folder.user'] });
      } else {
        enqueueSnackbar('Tidak ada tag baru untuk ditambahkan.', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error adding tags:', error);
      if (error.response && error.response.data.errors) {
        console.error('Server errors:', error.response.data.errors);
        if (error.response.data.errors.tag_id) {
          enqueueSnackbar('Tag sudah ada dalam folder.', { variant: 'warning' });
        }
      }
      enqueueSnackbar('Error saat menambahkan tag', { variant: 'error' });
    }
  };

  const handleDeleteFolder = async () => {
    try {
      await deleteFolder({ id: folderIdToDelete });
      enqueueSnackbar('Folder berhasil dihapus!', { variant: 'success' });
      handleCloseConfirmDialog();
      onDelete();
      useClient.invalidateQueries({ queryKey: ['folder.user'] });
    } catch (error) {
      console.error('Error deleting folder:', error);
      enqueueSnackbar('Terjadi kesalahan saat menghapus folder.', { variant: 'error' });
    }
  };

  const handleRemoveTag = async (tagId) => {
    if (tags.length <= 1) {
      enqueueSnackbar('Kamu harus menyisakan satu tag.', { variant: 'warning' });
      return;
    }

    try {
      await removeTagFolder({ id: id, tag_id: tagId }); // Updated to use id
      setTags((prevTags) => prevTags.filter((id) => id !== tagId));
      enqueueSnackbar('Tag berhasil dihapus!', { variant: 'success' });
      useClient.invalidateQueries({ queryKey: ['folder.user'] });
    } catch (error) {
      console.error('Error removing tag:', error);
      enqueueSnackbar('Error removing tag.', { variant: 'error' });
    }
  };

  const handleCopyLink = () => {
    const folderUrl = id; // Ensure this is the correct property for URL

    if (!folderUrl) {
      enqueueSnackbar('No URL to copy.', { variant: 'warning' });
      return;
    }

    navigator.clipboard
      .writeText(folderUrl)
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
    if (!id) {
      enqueueSnackbar('Folder ID is required to toggle favorite status!', { variant: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      if (favorite.value) {
        await removeFavorite({ folder_id: id });
        enqueueSnackbar('Folder dihapus dari favorit!', { variant: 'success' });
        useClient.invalidateQueries({ queryKey: ['folder.user'] });
      } else {
        await addFavorite({ folder_id: id });
        enqueueSnackbar('Folder ditambahkan ke favorit!', { variant: 'success' });
        useClient.invalidateQueries({ queryKey: ['folder.user'] });
      }

      favorite.onToggle();
    } catch (error) {
      console.error('Error updating favorite status:', error);
      enqueueSnackbar('Gagal memperbarui status favorit!', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [favorite.value, id, addFavorite, removeFavorite, enqueueSnackbar]);

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
            {fData(total_size)}
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
          Tidak dibagikan dengan siapa pun.
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

          <Typography variant="subtitle2">{name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {fData(total_size)}
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
                Name
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

          <FileManagerShareDialogFolder
            open={share.value}
            folderId={id}
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
            Close
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
          <Typography>Apa kamu yakin hapus folder ini?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Batal
          </Button>
          <Button onClick={handleDeleteFolder} color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}

FolderDetail.propTypes = {
  item: PropTypes.object,
  open: PropTypes.bool,
  favorited: PropTypes.bool,
  onFavorite: PropTypes.func,
  onCopyLink: PropTypes.func,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};
