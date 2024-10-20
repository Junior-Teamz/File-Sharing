import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
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
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useMutationFolder } from '../overview/app/view/folders';
import { useIndexTag } from '../tag/view/TagMutation';

export default function FileManagerNewFolderDialog({
  title,
  open,
  onClose,
  onTagChange,
  ...other
}) {
  const [files, setFiles] = useState([]);
  const { register, handleSubmit, reset, setValue, getValues, formState: { errors }, setError } = useForm();
  const { data, isLoading: isLoadingTags } = useIndexTag();
  const tagsData = data?.data || [];
  const [selectedTags, setSelectedTags] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      reset(); // Reset form when dialog is opened
      setFiles([]); // Clear files on dialog open
      setSelectedTags([]); // Reset selected tags on dialog open
      setValue('name', ''); // Ensure the folder name is also reset
    }
  }, [open, reset, setValue]);

  const handleCreate = () => {
    const nameValue = getValues('name');
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

    createFolder(formData);
  };

  const { mutate: createFolder, isPending: loadingUpload } = useMutationFolder({
    onSuccess: () => {
      enqueueSnackbar('Berhasil Membuat Folder', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fetch.folder.admin'] });
      reset();
      setFiles([]);
      setSelectedTags([]);
      onClose();
    },
    onError: (error) => {
      if (error.errors && error.errors.name) {
        setError('name', {
          type: 'manual',
          message: error.errors.name[0],
        });
      } else {
        enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
      }
    },
  });

  const handleTagChange = (event) => {
    const value = event.target.value;
    setSelectedTags(value);
    if (typeof onTagChange === 'function') {
      onTagChange(value);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>{title}</DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <TextField
          fullWidth
          label="Name"
          {...register('name', { required: 'Nama Folder Harus Di Isi' })}
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : ''}
          sx={{ mb: 3 }}
        />

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
      </DialogContent>

      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleSubmit(handleCreate)}
        >
          {loadingUpload ? 'Loading...' : 'Create Folder'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FileManagerNewFolderDialog.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onTagChange: PropTypes.func.isRequired,
};
