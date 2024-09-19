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
import { useAddFileTag, useRemoveTagFile } from './view/folderDetail/index';
import { useIndexTag } from '../tag/view/TagMutation';
import { useSnackbar } from 'notistack'; // Import useSnackbar from notistack

// ----------------------------------------------------------------------

export default function FileManagerFileDetails({
  item,
  open,
  favorited,
  onFavorite,
  onCopyLink,
  onClose,
  onDelete,
  ...other
}) {
  const { enqueueSnackbar } = useSnackbar(); // Initialize enqueueSnackbar
  const { name, size, image_url, type, shared, modifiedAt, user, instance, tags: initialTags , updated_at} = item;

  const [tags, setTags] = useState(initialTags.map((tag) => tag.id));
  const [availableTags, setAvailableTags] = useState([]);

  const toggleTags = useBoolean(true);
  const share = useBoolean();
  const properties = useBoolean(true);

  const [inviteEmail, setInviteEmail] = useState('');

  const { data: tagData } = useIndexTag(); // Assuming this returns tag data
  const addTagFile = useAddFileTag();
  const { mutateAsync: removeTagFile } = useRemoveTagFile();

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
          <FileThumbnail
            imageView
            file={item}
            sx={{ height: 96, width: 96, borderRadius: 1.5 }}
            src={image_url}
            alt={name}
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

          {renderShared}

          <Button fullWidth size="small" color="inherit" variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}

FileManagerFileDetails.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool,
  favorited: PropTypes.bool,
  onFavorite: PropTypes.func,
  onCopyLink: PropTypes.func,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};
