import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';
import { enqueueSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutationUploadFiles } from './view/FetchDriveUser/useMutationUploadFiles';
import { useIndexTag } from './view/TagUser/useIndexTag';
import { useQueryClient } from '@tanstack/react-query';
import { RHFAutocomplete } from 'src/components/hook-form';
import { fData } from 'src/utils/format-number';

export default function FileManagerNewFileDialog({
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
  const methods = useForm();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const { data, isLoading: isLoadingTags } = useIndexTag();
  const tagsData = data?.data || [];
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (!open) {
      setFiles([]);
      methods.reset();
      setSelectedTags([]); // Reset selected tags when modal closes
      setProgress(0);
    }
  }, [open, methods]);

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
      enqueueSnackbar('File Berhasil Di Upload');
      handleRemoveAllFiles();
      methods.reset();
      onClose();
      queryClient.invalidateQueries({ queryKey: ['fetch.folder'] });
    },
    onError: (error) => {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            errors[key].forEach((message) => {
              enqueueSnackbar(`${key}: ${message}`, { variant: 'error' });
            });
          }
        }
      } else {
        enqueueSnackbar('Upload failed. Please try again.', { variant: 'error' });
      }
    },
    onUploadProgress: (percentCompleted) => {
      setProgress(percentCompleted);
    },
  });

  const handleUpload = () => {
    if (!files.length) {
      enqueueSnackbar('Silakan pilih file yang akan diunggah', { variant: 'warning' });
      return;
    }

    if (!selectedTags.length) {
      enqueueSnackbar('Please select at least one tag', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    setProgress(0);

    files.forEach((file) => {
      formData.append('file[]', file); // Adjust according to server-side expectations
    });

    selectedTags.forEach((tagId) => {
      formData.append('tag_ids[]', tagId); // Send tag ids
    });

    uploadFiles(formData);
  };

  const handleRemoveFile = (inputFile) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== inputFile));
    URL.revokeObjectURL(inputFile.preview);
  };

  const handleRemoveAllFiles = () => {
    files.forEach((file) => URL.revokeObjectURL(file.preview));
    setFiles([]);
    setProgress(0);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle>{title}</DialogTitle>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit}>
          <DialogContent dividers>
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
              <RHFAutocomplete
                name="tags"
                label="Tags"
                multiple
                options={tagsData}
                getOptionLabel={(option) => option.name} // Display tag names
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, newValue) => {
                  setSelectedTags(newValue.map((tag) => tag.id)); // Store tag ids
                  methods.setValue('tags', newValue); // Show names in autocomplete
                }}
                renderTags={(value, getTagProps) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {value.map((tag, index) => (
                      <Chip key={tag.id} label={tag.name} {...getTagProps({ index })} />
                    ))}
                  </Box>
                )}
                loading={isLoadingTags}
              />
            </FormControl>

            <Upload multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />

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
                      <Box
                        sx={{ width: `${progress}%`, backgroundColor: '#4caf50', height: '100%' }}
                      />
                    </Box>
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                      {file.name} - {fData(file.size)} {progress}%
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
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
              onClick={handleUpload}
              disabled={loadingUpload}
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
                <Button variant="soft" onClick={onUpdate || onCreate}>
                  {onUpdate ? 'Save' : 'Create'}
                </Button>
              </Stack>
            )}
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}

FileManagerNewFileDialog.propTypes = {
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  refetch: PropTypes.func,
  onTagChange: PropTypes.func.isRequired,
};
