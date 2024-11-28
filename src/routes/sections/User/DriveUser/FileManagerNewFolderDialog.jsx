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
  refetch = () => {}, 
  ...other
}) {
  const methods = useForm();
  const [files, setFiles] = useState([]);
  const { data, isLoading: isLoadingTags } = useIndexTag();
  const tagsData = data?.data || [];
  const [selectedTags, setSelectedTags] = useState([]);
  const useClient = useQueryClient();

  useEffect(() => {
    if (open) {
      methods.reset();
      setFiles([]);
      setSelectedTags([]);
      methods.setValue('name', '');
    }
  }, [open, methods]);

  const { mutate: CreateFolder, isPending: loadingUpload } = useMutationFolder({
    onSuccess: () => {
      enqueueSnackbar('Folder berhasil dibuat');
      handleRemoveAllFiles();
      methods.reset(); 
      useClient.invalidateQueries({ queryKey: ['folder.user'] });
      onClose(); 
    },
    onError: (error) => {
      // Check if the error has the expected structure
      if (error.errors && error.errors.name) {
        // Set form error for the name field
        methods.setError('name', {
          type: 'manual',
          message: error.errors.name[0], // "Instance name already exists."
        });
      } else {
        enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
      }
    },
  });

  const handleCreate = () => {
    const nameValue = methods.getValues('name');
    // Validate both name and tags
    if (!nameValue || !selectedTags.length) {
      enqueueSnackbar('Silakan isi kolom yang diperlukan: nama dan tag', { variant: 'warning' });
      return;
    }

    const formData = new FormData();

    selectedTags.forEach((tag) => {
      formData.append('tag_ids[]', tag.id); // Assuming each tag has an id
    });

    formData.append('name', nameValue);

    CreateFolder(formData);
  };

  const handleTagChange = (event, newValue) => {
    setSelectedTags(newValue); // Keep track of selected tags
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => handleCreate())}>
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
                onChange={handleTagChange}
                renderTags={(value, getTagProps) => (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                      maxHeight: 100,
                      overflowY: 'auto',
                    }}
                  >
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
            <Button type="submit" variant="contained" disabled={loadingUpload}>
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