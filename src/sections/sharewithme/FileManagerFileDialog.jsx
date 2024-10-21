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
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
// components
import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useMutationUploadFiles } from '../file-manager/view/folderDetail/useMutationUploadFiles';
import { useIndexTag } from '../tag/view/TagMutation';

export default function FileManagerFileDialog({
  title,
  open,
  onClose,
  onCreate,
  onUpdate,
  folderName,
  onChangeFolderName,
  onTagChange,
  refetch = () => {},
  ...other
}) {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0); // Tambahkan state progress
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue } = useForm();
  const { data, isLoading: isLoadingTags } = useIndexTag();
  const tagsData = data?.data || [];

  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (!open) {
      setFiles([]);
      reset(); // Reset form ketika dialog ditutup
    }
  }, [open, reset]);

  const handleDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const { mutate: uploadFiles, isPending: loadingUpload } = useMutationUploadFiles({
    onSuccess: () => {
      enqueueSnackbar('Files Uploaded Successfully');
      handleRemoveAllFiles();
      reset();
      onClose();
      queryClient.invalidateQueries({ queryKey: ['fetch.folder.admin'] });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
    onUploadProgress: (percentCompleted) => {
      setProgress(percentCompleted); // Update progress state
    },
  });

  const handleUpload = () => {
    if (!files.length) {
      enqueueSnackbar('Please select files to upload', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file[]', file); // Sesuaikan dengan server-side
    });

    selectedTags.forEach((tagId) => {
      formData.append('tag_ids[]', tagId);
    });

    uploadFiles(formData); // Mulai upload file
  };

  const handleRemoveFile = (inputFile) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== inputFile));
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const handleTagChange = (event) => {
    const value = event.target.value;
    if (Array.isArray(value)) {
      setSelectedTags(value);
      if (typeof onTagChange === 'function') {
        onTagChange(value);
      } else {
        console.warn('onTagChange is not a function');
      }
    } else {
      console.error('Unexpected value type:', value);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0 }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}
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

        {/* Progress Bar and File Sizes */}
        {(loadingUpload || progress > 0) && (
          <Box sx={{ width: '100%', mt: 2 }}>
            {files.map((file) => (
              <Box key={file.name} sx={{ mb: 1 }}>
                <Box
                  sx={{
                    height: 10,
                    backgroundColor: '#f0f0f0',
                    borderRadius: '5px',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ width: `${progress}%`, backgroundColor: '#4caf50', height: '100%' }} />
                </Box>
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  {file.name} - {Math.round(file.size / 1024)} KB - {progress}%
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          startIcon={
            loadingUpload ? (
              <Iconify icon="eva:loader-outline" spin />
            ) : (
              <Iconify icon="eva:cloud-upload-fill" />
            )
          }
          onClick={handleUpload}
          disabled={loadingUpload} // Disable tombol saat sedang upload
        >
          {loadingUpload ? 'Uploading...' : 'Upload Files'}
        </Button>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onUpdate || onCreate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}

FileManagerFileDialog.propTypes = {
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  refetch: PropTypes.func,
  onTagChange: PropTypes.func.isRequired,
  tagsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  selectedTags: PropTypes.arrayOf(PropTypes.string),
  isLoadingTags: PropTypes.bool,
};
