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
import FileManagerShareDialog from './file-manager-share-dialog';
import FileManagerInvitedItem from './file-manager-invited-item';
import {
  useAddFileTag,
  useRemoveTagFile,
  useMutationDeleteFiles,
  usePermissionsFolder,
  usePermissionsFile,
} from './view/folderDetail/index';
import { useIndexTag } from '../tag/view/TagMutation';
import { useSnackbar } from 'notistack'; // Import useSnackbar from notistack
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// ----------------------------------------------------------------------

export default function FIleManagerFileDetails({
  item,
  open,
  favorited,
  onFavorite,
  onCopyLink,
  onClose,
  onDelete,
  folderId,
  fileId,
  ...other
}) {
  const { enqueueSnackbar } = useSnackbar(); // Initialize enqueueSnackbar
  const {
    name,
    size,
    image_url,
    type,
    shared,
    modifiedAt,
    user,
    instance,
    tags: initialTags,
    updated_at,
  } = item;

  const [tags, setTags] = useState(initialTags.map((tag) => tag.id));
  const [availableTags, setAvailableTags] = useState([]);

  const toggleTags = useBoolean(true);
  const share = useBoolean();
  const properties = useBoolean(true);
  const [fileIdToDelete, setFileIdToDelete] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [inviteEmail, setInviteEmail] = useState('');

  const { data: tagData } = useIndexTag(); // Assuming this returns tag data
  const addTagFile = useAddFileTag();
  const { mutateAsync: removeTagFile } = useRemoveTagFile();
  const { mutateAsync: deleteFile } = useMutationDeleteFiles();

  useEffect(() => {
    if (tagData && Array.isArray(tagData.data)) {
      setAvailableTags(tagData.data); // Extract and set the tags array
    } else {
      console.error('Expected tagData.data to be an array, but got:', tagData);
    }
  }, [tagData]);

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleChangeTags = useCallback((event, newValue) => {
    if (Array.isArray(newValue)) {
      setTags(newValue.map((tag) => tag.id)); // Assuming newValue is an array of tag objects
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

  const handleSaveTags = async () => {
    if (!addTagFile.mutateAsync) {
      console.error('addTagFile.mutateAsync is not a function');
      return;
    }

    try {
      // Determine which tags are new
      const existingTagIds = new Set(initialTags.map((tag) => tag.id));
      const newTagIds = tags.filter((tagId) => !existingTagIds.has(tagId));

      if (newTagIds.length > 0) {
        for (const tagId of newTagIds) {
          await addTagFile.mutateAsync({
            file_id: item.id,
            tag_id: tagId,
          });
        }
        enqueueSnackbar('Tags added successfully!', { variant: 'success' });
      } else {
        enqueueSnackbar('No new tags to add.', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error adding tags:', error);
      if (error.response && error.response.data.errors) {
        // Log specific errors from the server
        console.error('Server errors:', error.response.data.errors);
        if (error.response.data.errors.tag_id) {
          enqueueSnackbar('Tag already exists in folder.', { variant: 'warning' });
        }
      }
      enqueueSnackbar('Error adding tags.', { variant: 'error' });
    }
  };

  const handleDeleteFile = async () => {
    try {
      await deleteFile({ file_id: fileIdToDelete });
      enqueueSnackbar('File deleted successfully!', { variant: 'success' });
      handleCloseConfirmDialog();
      // Optionally, call a prop function to refresh the file list
    } catch (error) {
      console.error('Error deleting file:', error);
      enqueueSnackbar('Error deleting file.', { variant: 'error' });
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
      enqueueSnackbar('Tag removed successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error removing tag:', error);
      enqueueSnackbar('Error removing tag.', { variant: 'error' });
    }
  };

  // Menggunakan usePermissionsFile atau usePermissionsFolder
  const { permissions: filePermissions } = usePermissionsFile(fileId);
  const { permissions: folderPermissions } = usePermissionsFolder(folderId);

  const [currentPermissions, setCurrentPermissions] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    console.log('folderId:', folderId);
    console.log('fileId:', fileId);
    if (folderId) {
      setCurrentPermissions(folderPermissions);
    } else if (fileId) {
      setCurrentPermissions(filePermissions);
    }
  }, [folderId, fileId, folderPermissions, filePermissions]);

  useEffect(() => {
    const id = folderId || fileId;
    if (id) {
      const newLink = `${window.location.origin}/shared/${id}?permission=${currentPermissions}`;
      setLink(newLink);
    }
  }, [folderId, fileId, currentPermissions]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    alert('Link copied: ' + link);
    if (onCopyLink) onCopyLink(link); // Panggil props onCopyLink
  };

  // const handleCopyLink = () => {
  //   const fileUrl = item.url; // Ensure this is the correct property for URL

  //   console.log('File URL:', fileUrl); // Debugging line

  //   if (!fileUrl) {
  //     enqueueSnackbar('No URL to copy.', { variant: 'warning' });
  //     return;
  //   }

  //   navigator.clipboard
  //     .writeText(fileUrl)
  //     .then(() => enqueueSnackbar('Link copied to clipboard!', { variant: 'success' }))
  //     .catch((err) => {
  //       console.error('Failed to copy link:', err);
  //       enqueueSnackbar('Failed to copy link.', { variant: 'error' });
  //     });
  // };

  console.log('Image URL:', image_url);

  const renderTags = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Tags
        <IconButton size="small" onClick={toggleTags.onToggle}>
          <Iconify
            icon={toggleTags.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {toggleTags.value && (
        <Autocomplete
          multiple
          options={availableTags} // Array of tag objects
          getOptionLabel={(option) => option.name} // Display name
          value={availableTags.filter((tag) => tags.includes(tag.id))} // Display selected tags
          onChange={handleChangeTags} // Update tags state
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
          renderInput={(params) => <TextField {...params} placeholder="#Add a tag" />}
        />
      )}
      <Button onClick={handleSaveTags}>Save Tags</Button>
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
        Properties
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
              Size
            </Box>
            {fData(size)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Modified
            </Box>
            {fDateTime(updated_at)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Type
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
        <Typography variant="subtitle2"> File Shared With </Typography>

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

      {shared && shared.length > 0 && (
        <Box sx={{ pl: 2.5, pr: 1 }}>
          {shared.map((person) => (
            <FileManagerInvitedItem key={person.id} person={person} />
          ))}
        </Box>
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
            checked={favorited}
            onChange={onFavorite}
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
          {/* Uncomment and use for displaying file thumbnail if needed */}
          <img
            src={image_url}
            alt={name}
            style={{ height: 96, width: 96, borderRadius: '12px', objectFit: 'cover' }} // Adjust style as needed
          />

          <Typography variant="subtitle2">{name}</Typography>
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
                Name
              </Box>
              {user?.name}
            </Stack>

            {/* <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
                <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                  Email
                </Box>
                {user?.email}
              </Stack> */}

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
            shared={shared}
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
              Delete
            </Button>
          </Box>
        </Stack>
      </Scrollbar>
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this file?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteFile} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}

FIleManagerFileDetails.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool,
  favorited: PropTypes.bool,
  onFavorite: PropTypes.func,
  onCopyLink: PropTypes.func,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};
