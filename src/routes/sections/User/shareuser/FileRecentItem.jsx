import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
// utils
import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import FileThumbnail from 'src/components/file-thumbnail';
import FileManagerShareDialog from './FileManagerShareDialog';
import FileManagerFileDetails from './FileManagerFileDetails';
import { Button } from '@mui/material';
import { useRemoveFavoriteUser, useAddFavoriteUser } from './view/FetchFolderUser';
import { useDownloadFile, useChangeNameFile } from './view/FetchDriveUser';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export default function FileRecentItem({ file, onDelete, sx, onRefetch, ...other }) {
  const { enqueueSnackbar } = useSnackbar();
  const { copy } = useCopyToClipboard();
  const smUp = useResponsive('up', 'sm');
  const [inviteEmail, setInviteEmail] = useState('');
  const [newFileName, setNewFileName] = useState(file.name);
  const popover = usePopover();
  const share = useBoolean();
  const edit = useBoolean();
  const details = useBoolean();
  const favorite = useBoolean(file.isFavorited);
  const [originalFileType, setOriginalFileType] = useState(file.type);
  const useClient = useQueryClient();

  const { mutateAsync: updateNameFile } = useChangeNameFile();
  const { mutateAsync: downloadFile } = useDownloadFile();

  useEffect(() => {
    setNewFileName(file.name);
    setOriginalFileType(file.type);
  }, [file]);

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleRename = useCallback(async () => {
    const newFileType = newFileName.split('.').pop(); // Extract new file type from name

    if (newFileType !== originalFileType.split('.').pop()) {
      enqueueSnackbar('Type file tidak boleh diubah!', { variant: 'error' });
      return;
    }

    try {
      await updateNameFile({ fileId: file.id, data: { name: newFileName } });
      enqueueSnackbar('File name updated successfully!', { variant: 'success' });
      onRefetch(); // Call to re-fetch the file data
      edit.onFalse(); // Close the edit dialog
    } catch (error) {
      enqueueSnackbar('Failed to update file name!', { variant: 'error' });
    }
  }, [file.id, newFileName, originalFileType, updateNameFile, enqueueSnackbar, edit, onRefetch]);

  const handleCopy = useCallback(() => {
   
    if (file?.id) {
      enqueueSnackbar('Berhasil di Copied!');
      copy(file.id); // Mengakses file.id langsung, tanpa [0] karena file bukan array
    } else {
      enqueueSnackbar('File URL is undefined!', { variant: 'error' });
    }
  }, [copy, enqueueSnackbar, file.id]);

  const { mutateAsync: addFavorite } = useAddFavoriteUser();
  const { mutateAsync: removeFavorite } = useRemoveFavoriteUser();

  // Function to handle the favorite toggle
  const handleFavoriteToggle = useCallback(async () => {
    if (!file.id) {
      enqueueSnackbar('File ID is required to toggle favorite status!', { variant: 'error' });
      return; // Early return if file.id is not valid
    }

    const payload = { file_id: file.id }; // Create a payload with the required structure
  

    try {
      if (favorite.value) {
        // If currently favorited, call removeFavorite
    
        await removeFavorite(payload, {
          // Pass the entire payload object
          onSuccess: () => {
            enqueueSnackbar('File removed from favorites!', { variant: 'success' });
          },
          onError: () => {
            enqueueSnackbar('Failed to remove from favorites!', { variant: 'error' });
          },
        });
      } else {
        // If not favorited, call addFavorite
        
        await addFavorite(payload, {
          // Pass the entire payload object
          onSuccess: () => {
            enqueueSnackbar('File added to favorites!', { variant: 'success' });
          },
          onError: () => {
            enqueueSnackbar('Failed to add to favorites!', { variant: 'error' });
          },
        });
      }

      // Toggle the favorite state
      favorite.onToggle();

      // Optionally refetch any relevant queries
      useClient.invalidateQueries({ queryKey: ['fetch.folder'] });
      useClient.invalidateQueries({ queryKey: ['detail-folder'] });
    } catch (error) {
      console.error('Error updating favorite status:', error); // Log the error
      enqueueSnackbar('Failed to update favorite status!', { variant: 'error' });
    }
  }, [favorite.value, file.id, removeFavorite, addFavorite, enqueueSnackbar, useClient]);

  // const handle = useCallback(() => {
  //   enqueueSnackbar('Link copied!');
  //   copy(folderData[0].url); // Adjust accordingly
  // }, [copy, enqueueSnackbar,folderData]);

  const handleDownload = useCallback(async () => {
    try {
      const idsToDownload = Array.isArray(file.ids) && file.ids.length ? file.ids : [file.id];
   

      // Send the correct payload to the API
      const response = await downloadFile(idsToDownload);

      if (response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name || 'download');
        document.body.appendChild(link);
        link.click();
        link.remove();
        enqueueSnackbar('Download started!', { variant: 'success' });
      } else {
        enqueueSnackbar('No data received for download!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Download error:', error);
      const errorMessage = error.response?.data?.error || 'Download failed!'; // Use error message from server if available
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [downloadFile, file, enqueueSnackbar]);

  const renderAction = (
    <Box
      sx={{
        top: 0,
        right: 8,
        position: 'absolute',
        ...(smUp && {
          flexShrink: 0,
          position: 'unset',
        }),
      }}
    >
      <Checkbox
        color="warning"
        icon={<Iconify icon="eva:star-outline" />}
        checkedIcon={<Iconify icon="eva:star-fill" />}
        checked={favorite.value}
        onChange={handleFavoriteToggle} // Update here to call handleFavoriteToggle
      />
      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </Box>
  );

  const renderText = (
    <ListItemText
      onClick={details.onTrue}
      primary={file.name}
      secondary={
        <>
          {fData(file.size)}
          <Box
            sx={{
              mx: 0.75,
              width: 2,
              height: 2,
              borderRadius: '50%',
              bgcolor: 'currentColor',
            }}
          />
          {fDateTime(file.modifiedAt)}
        </>
      }
      primaryTypographyProps={{
        noWrap: true,
        typography: 'subtitle2',
      }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        alignItems: 'center',
        typography: 'caption',
        color: 'text.disabled',
        display: 'inline-flex',
      }}
    />
  );

  const renderAvatar = (
    <AvatarGroup
      max={3}
      sx={{
        [`& .${avatarGroupClasses.avatar}`]: {
          width: 24,
          height: 24,
          '&:first-of-type': {
            fontSize: 12,
          },
        },
      }}
    >
      {file.shared?.map((person) => (
        <Avatar key={person.id} alt={person.name} src={person.avatarUrl} />
      ))}
    </AvatarGroup>
  );

  return (
    <>
      <Stack
        component={Paper}
        variant="outlined"
        spacing={1}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'unset', sm: 'center' }}
        sx={{
          borderRadius: 2,
          bgcolor: 'unset',
          cursor: 'pointer',
          position: 'relative',
          p: { xs: 2.5, sm: 2 },
          '&:hover': {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          },
          ...sx,
        }}
        {...other}
      >
        <FileThumbnail file={file.type} sx={{ width: 36, height: 36, mr: 1 }} />
        {renderText}
        {!!file?.shared?.length && renderAvatar}
        {renderAction}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            handleCopy();
          }}
        >
          <Iconify icon="eva:link-2-fill" />
          Copy Link
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            handleDownload();
          }}
        >
          <Iconify icon="solar:download-minimalistic-bold" />
          Download
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            share.onTrue();
          }}
        >
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            setNewFileName(file.name); // Set current file name
            edit.onTrue();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Ganti Nama
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <FileManagerFileDetails
        item={file}
        favorited={favorite.value}
        onFavorite={favorite.onToggle}
        onCopyLink={handleCopy}
        onRefetch={onRefetch}
        open={details.value}
        onClose={details.onFalse}
        onDelete={() => {
          details.onFalse();
          onDelete();
        }}
      />

      <FileManagerShareDialog
        open={share.value}
        shared={file.shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      <Dialog open={edit.value} onClose={edit.onFalse}>
        <DialogTitle>Ganti Nama File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New File Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={edit.onFalse}>Cancel</Button>
          <Button onClick={handleRename}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

FileRecentItem.propTypes = {
  file: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onRefetch: PropTypes.func.isRequired, // Added prop type for refetch function
  sx: PropTypes.object,
};
