import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEditUser } from './view/UserManagement';
import { useEffect } from 'react';
// @mui
import {
  Box,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export default function UserQuickEditForm({ currentUser, open, onClose, instances, onRefetch }) {
  const { enqueueSnackbar } = useSnackbar();
  const useClient = useQueryClient();
  const { mutate: editUser, isPending } = useEditUser({
    onSuccess: () => {
      enqueueSnackbar('User berhasil di update', { variant: 'success' });
      resetForm({
        name: '',
        email: '',
        instance_id: '',
        password: '',
        confirmPassword: '',
      });
      if (onRefetch) onRefetch();
      onClose();
      useClient.invalidateQueries({ queryKey: ['list.user'] });
    },
    onError: (error) => {
      enqueueSnackbar('Error update user', { variant: 'error' });
      console.error('Error update user', error);
    },
  });

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    instance_id: Yup.string().required('Instansi is required'), // Use instance_id here
  });

  // React Hook Form methods
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      email: '',
      instance_id: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    reset: resetForm, // Destructure reset to use as resetForm
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  // Set initial form data when `currentUser` changes
  useEffect(() => {
    if (currentUser) {
      resetForm({
        name: currentUser.name,
        email: currentUser.email,
        instance_id: currentUser.instances?.[0]?.id || '', // Ambil id instansi pertama jika ada
        password: '',
        confirmPassword: '',
      });
    }
  }, [currentUser, resetForm]);

  // Form submission handler
  const onSubmit = (data) => {
    const userData = {
      name: data.name,
      email: data.email,
      instance_id: data.instance_id, // Use instance_id here
      ...(data.password ? { password: data.password } : {}),
      password_confirmation: data.confirmPassword, // Ensure confirmPassword is included if password is provided
    };

    if (!data.password) {
      delete userData.password_confirmation;
    }
    
    editUser({ userId: currentUser.id, data: userData });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Edit User</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            mt={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="name" label="Full Name" />
            <RHFTextField name="email" label="Email Address" />

            {/* Dropdown to select instansi */}
            <FormControl fullWidth>
              <InputLabel id="instansi-label">Instansi</InputLabel>
              <Select
                labelId="instansi-label"
                id="instance_id" // Ensure the id matches the field name
                name="instance_id" // Use instance_id as the name
                label="Instansi"
                value={watch('instance_id')} // Bind the selected value
                onChange={(e) => setValue('instance_id', e.target.value)} // Set instance_id on change
              >
                {instances &&
                  instances.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name} {/* Display instansi name */}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <RHFTextField name="password" label="Password" type="password" />
            <RHFTextField name="confirmPassword" label="Confirm Password" type="password" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="contained" type="submit">
            {isPending ? 'Update User....' : 'Update User'}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

UserQuickEditForm.propTypes = {
  currentUser: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  instances: PropTypes.array.isRequired, // Expect an array of instansi objects
  onRefetch: PropTypes.func, // Callback to refetch user list
};
