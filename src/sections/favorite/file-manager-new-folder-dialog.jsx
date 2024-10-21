import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
// @mui
import {
  Button,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  Dialog,
  FormControl,
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useMutationFolder } from '../overview/app/view/folders';
import { useIndexTag } from '../tag/view/TagMutation';
import SlimSelect from 'slim-select';
import './view/css/Slim.css';

export default function FileManagerNewFolderDialog({
  title,
  open,
  onClose,
  onTagChange,
  ...other
}) {
  const [files, setFiles] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const selectRef = useRef(null);

  const queryClient = useQueryClient();
  const { data, isLoading: isLoadingTags } = useIndexTag();
  const tagsData = data?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (open) {
      reset(); // Reset form on open
      setFiles([]);
      setSelectedTags([]);
    }
  }, [open, reset]);

  useEffect(() => {
    if (selectRef.current) {
      const slimSelect = new SlimSelect({
        select: selectRef.current,
        placeholder: 'Pilih tag',
        closeOnSelect: false,
        onChange: (info) => {
          const values = info.map((tag) => tag.value);
          setSelectedTags(values);
          console.log('Selected Tags:', values); // Debug log
          if (typeof onTagChange === 'function') {
            onTagChange(values);
          }
        },
      });

      return () => {
        slimSelect.destroy(); // Clean up on component unmount
      };
    }
  }, [tagsData, onTagChange]);

  const { mutate: createFolder, isPending: loadingUpload } = useMutationFolder({
    onSuccess: () => {
      enqueueSnackbar('Berhasil Membuat Folder', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fetch.folder.admin'] });
      reset();
      setFiles([]);
      setSelectedTags([]); // Reset selected tags
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

  const onSubmit = (formData) => {
    const { name } = formData;
    console.log('Form Data:', formData); // Debug log
    console.log('Selected Tags:', selectedTags); // Debug log
    if (!name || selectedTags.length === 0) {
      enqueueSnackbar('Please fill in the required fields: name and tags', {
        variant: 'warning',
      });
      return;
    }

    const data = new FormData();
    files.forEach((file) => data.append('file[]', file));
    selectedTags.forEach((tagId) => data.append('tag_ids[]', tagId));
    data.append('name', name);

    createFolder(data);
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
          <select ref={selectRef} id="tag-label" multiple>
            {tagsData.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleSubmit(onSubmit)}
        >
          {loadingUpload ? 'Loading...' : 'Buat Folder'}
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
