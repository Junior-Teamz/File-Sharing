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
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
// components
import Iconify from 'src/components/iconify';
import { enqueueSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';
import { useIndexTag } from './view/TagUser/useIndexTag';
import { useMutationFolder } from './view/FetchFolderUser';
import { useQueryClient } from '@tanstack/react-query';
import { RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function FileManagerNewFolderDialog({
  title,
  open,
  onClose,
  onCreate,
  onUpdate,
  folderName,
  onChangeFolderName,
  onTagChange,
  refetch = () => {}, // Provide a fallback function
  ...other
}) {
  const methods = useForm();
  const [files, setFiles] = useState([]);
  const { data, isLoading: isLoadingTags } = useIndexTag();
  const tagsData = data?.data || [];
  const [selectedTags, setSelectedTags] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      methods.reset(); // Reset form when dialog is opened
      setFiles([]); // Clear files on dialog open
      setSelectedTags([]); // Reset selected tags on dialog open
      methods.setValue('name', ''); // Ensure the folder name is also reset
    }
  }, [open, methods]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      if (acceptedFiles.length && !methods.getValues('name')) {
        const folderName = acceptedFiles[0].webkitRelativePath
          ? acceptedFiles[0].webkitRelativePath.split('/')[0]
          : acceptedFiles[0].name;
        methods.setValue('name', folderName); // Set the folder name
      }

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
    [methods]
  );

  const { mutate: CreateFolder, isPending: loadingUpload } = useMutationFolder({
    onSuccess: () => {
      enqueueSnackbar('Folder Created Successfully');
      handleRemoveAllFiles();
      methods.reset(); // Reset form after successful upload
      queryClient.invalidateQueries({ queryKey: ['fetch.folder'] });
      onClose(); // Close dialog after successful upload
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  const handleCreate = () => {
    const nameValue = methods.getValues('name');
    if (!nameValue || !selectedTags.length) {
      enqueueSnackbar('Please fill in the required fields: name and tags', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file[]', file);
    });

    selectedTags.forEach((tagId) => {
      formData.append('tag_ids[]', tagId);
    });

    formData.append('name', nameValue);

    CreateFolder(formData);
  };

  const handleRemoveFile = (inputFile) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== inputFile));
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const handleTagChange = (event) => {
    const value = event.target.value;
    setSelectedTags(value);
    if (typeof onTagChange === 'function') {
      onTagChange(value);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit}>
          <DialogTitle>{title}</DialogTitle>

          <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
            <TextField fullWidth label="Name" {...methods.register('name')} required />
            <FormControl fullWidth margin="dense">
              <RHFAutocomplete
                name="tags"
                label="Tags"
                multiple
                options={tagsData}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, newValue) => {
                  methods.setValue('tags', newValue);
                }}
                renderTags={(value, getTagProps) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxHeight: 100, overflowY: 'auto' }}>
                    {value.map((tag, index) => (
                      <Chip key={tag.id} label={tag.name} {...getTagProps({ index })} />
                    ))}
                  </Box>
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                loading={isLoadingTags}
              />
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button type="submit" variant="contained">
              Buat Folder
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}

FileManagerNewFolderDialog.propTypes = {
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
