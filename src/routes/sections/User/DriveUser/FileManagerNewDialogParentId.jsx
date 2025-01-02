import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Select, MenuItem, OutlinedInput, Chip, Box } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';
import { enqueueSnackbar } from 'notistack';
import { useIndexTag } from './view/TagUser/useIndexTag';
import { useMutationUploadFilesId } from './view/FetchDriveUser/useMutationUploadFilesId';

export default function FileManagerNewDialogParent({
  title,
  open,
  onClose,
  id,
  onCreate,
  onUpdate,
  folderName,
  onChangeFolderName,
  refetch,
  selectedTags = [],
  onTagChange,
  ...other
}) {
  const [files, setFiles] = useState([]);
  const [tagsData, setTagsData] = useState([]);

  // Fetch tags using useIndexTag hook
  const { data: tags = {}, isLoading: isLoadingTags, error: tagsError } = useIndexTag();

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  useEffect(() => {
    if (tags.data && Array.isArray(tags.data)) {
      setTagsData(tags.data);
    } else if (tagsError) {
      console.error('Error fetching tags:', tagsError);
    }
  }, [tags.data, tagsError]);

  const handleDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const { mutate: uploadFiles, isPending: loadingUpload } = useMutationUploadFilesId({
    onSuccess: () => {
      enqueueSnackbar('Files Uploaded Successfully');
      handleRemoveAllFiles();
      onClose();
      refetch?.();
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  const handleUpload = () => {
    if (!files.length) {
      enqueueSnackbar('Please select files to upload', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('id', id);

    files.forEach((file) => {
      formData.append('file[]', file);
    });

    // Append the tag IDs using 'tag_ids' instead of 'tags[]'
    selectedTags.forEach((tagId) => {
      formData.append('tag_ids[]', tagId); // Change 'tags[]' to 'tag_ids[]'
    });

    uploadFiles(formData);
  };

  const handleRemoveFile = (inputFile) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== inputFile));
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const handleTagChange = (event) => {
    // Extract the selected tag IDs from the event
    const value = event.target.value;

    // Update the parent component or state with selected tag IDs
    if (Array.isArray(value)) {
      onTagChange(value); // Pass the tag IDs to the parent
    } else {
      console.error('Unexpected value type:', value);
    }
  };

  useEffect(() => {}, [selectedTags, tagsData]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>{title}</DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {/* Tag Selection */}
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

        <Upload multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
      </DialogContent>

      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
        >
          {loadingUpload ? 'Loading...' : 'Upload File'}
        </Button>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}

FileManagerNewDialogParent.propTypes = {
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  refetch: PropTypes.func,
  selectedTags: PropTypes.arrayOf(PropTypes.string),
  onTagChange: PropTypes.func.isRequired,
};
