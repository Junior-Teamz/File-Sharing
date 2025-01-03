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
// components
import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';
import { enqueueSnackbar } from 'notistack';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useMutationUploadFiles } from './view/FetchDriveUser/useMutationUploadFiles';
import { useIndexTag } from './view/TagUser/useIndexTag';
import { RHFAutocomplete } from 'src/components/hook-form';
import { Box, Chip, FormControl } from '@mui/material';
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
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const queryClient = useQueryClient();

  const methods = useForm();
  const { control, handleSubmit, reset } = methods;
  const { data, isLoading: isLoadingTags } = useIndexTag();
  const tagsData = data?.data || [];

  useEffect(() => {
    if (!open) {
      setFiles([]);
      setProgress(0);
      reset();
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
      enqueueSnackbar('File Berhasil Di Upload');
      handleRemoveAllFiles();
      reset();
      setProgress(0);
      onClose();
      queryClient.invalidateQueries({ queryKey: ['folder.user'] });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
      setProgress(0);
    },
    onUploadProgress: (percentCompleted) => {
      setProgress(percentCompleted);
    },
  });

  const handleUpload = (data) => {
    if (!files.length) {
      enqueueSnackbar('Silakan pilih file yang akan diunggah', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file[]', file);
    });

    selectedTags.forEach((tagId) => {
      formData.append('tag_ids[]', tagId);
    });

    uploadFiles(formData);
  };

  const handleRemoveFile = (inputFile) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== inputFile));
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle>{title}</DialogTitle>

      <FormProvider {...methods}>
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
            <RHFAutocomplete
              name="tags"
              label="Tags"
              multiple
              options={tagsData}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, newValue) => {
                const tagIds = newValue.map((tag) => tag.id);
                setSelectedTags(tagIds);
                methods.setValue('tags', newValue);
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
            startIcon={
              loadingUpload ? (
                <Iconify icon="eva:loader-outline" spin />
              ) : (
                <Iconify icon="eva:cloud-upload-fill" />
              )
            }
            onClick={handleSubmit(handleUpload)}
            disabled={loadingUpload}
          >
            {loadingUpload ? 'Uploading...' : 'Upload File'}
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
