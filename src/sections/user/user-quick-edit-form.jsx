import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'src/components/snackbar';
import { useQueryClient } from '@tanstack/react-query';
import { useEditUser, usePermissionAdmin } from './view/UserManagement';
import { useGetSection } from '../Section/view/sectionsFetch';
// @mui
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Chip,
} from '@mui/material';
import FormProvider, { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';

export default function UserQuickEditForm({ currentUser, open, onClose, instances, onRefetch }) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { data: instanceSections = [], isLoading: isLoadingSection } = useGetSection();
  const { data: permissionList = [], isLoading: isLoadingPermission } = usePermissionAdmin();
  console.log(currentUser);
  // console.log(currentUser.roles);
  const RolesUser = Array.isArray(currentUser.roles)
    ? currentUser.roles.find((item) => item === 'superadmin' || item === 'admin')
    : currentUser.roles === 'superadmin' || currentUser.roles === 'admin';

  // console.log(RolesUser);

  const allowedDomains = [
    'outlook.com',
    'yahoo.com',
    'aol.com',
    'lycos.com',
    'mail.com',
    'icloud.com',
    'yandex.com',
    'protonmail.com',
    'tutanota.com',
    'zoho.com',
    'gmail.com',
  ];

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nama harus di isi').max(100, 'Nama maksimal 100 karakter'),
    email: Yup.string()
      .required('Email harus di isi')
      .email('Email harus berupa alamat email yang valid')
      .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Format email tidak valid')
      .test('is-valid-domain', 'Domain email tidak valid', (value) => {
        const domain = value ? value.split('@')[1] : '';
        return allowedDomains.includes(domain);
      }),
    password: Yup.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password harus sama'),
    instance_id: Yup.string().required('Instansi harus dipilih'),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      email: '',
      instance_id: '',
      password: '',
      confirmPassword: '',
      permissions: [],
    },
  });

  const {
    reset,
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = methods;

  const { mutate: editUser, isPending } = useEditUser({
    onSuccess: () => {
      enqueueSnackbar('User berhasil diperbarui', { variant: 'success' });

      // Reset hanya password dan confirmPassword setelah update
      reset((values) => ({
        ...values,
        password: '',
        confirmPassword: '',
      }));

      if (onRefetch) onRefetch();
      onClose();
      queryClient.invalidateQueries({ queryKey: ['list.user'] });
    },
    onError: (error) => {
      enqueueSnackbar('Terjadi kesalahan saat memperbarui user', { variant: 'error' });
      console.error('Error update user', error);
    },
  });

  // Set nilai awal saat `currentUser` berubah
  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: '',
        confirmPassword: '',
        role: currentUser.roles || '',
        instance_id: currentUser.instances?.[0]?.id || '', // Ensure to get only the 'id' of the instance
        instance_section_id: currentUser.section?.[0]?.id || '',
        permissions: Array.isArray(currentUser.permissions)
          ? currentUser.permissions.map((p) => p.id)
          : [],
      });
    }
  }, [currentUser, reset]);

  const onSubmit = (data) => {
    const userData = {
      name: data.name,
      email: data.email,
      instance_id: data.instance_id,
      ...(data.password
        ? { password: data.password, password_confirmation: data.confirmPassword }
        : {}),
      permissions: data.permissions, // Include permissions if available
    };

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
            <RHFTextField name="name" label="Nama Lengkap" />
            <RHFTextField name="email" label="Alamat Email" />

            <FormControl fullWidth>
              <InputLabel id="instansi-label">Instansi</InputLabel>
              <Controller
                name="instance_id"
                control={control}
                render={({ field }) => (
                  <Select labelId="instansi-label" {...field}>
                    {instances?.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <RHFSelect name="instance_section_id" label="Unit Kerja*" disabled={isLoadingSection}>
              {!isLoadingSection &&
                Array.isArray(instanceSections) &&
                instanceSections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.nama}
                  </MenuItem>
                ))}
            </RHFSelect>

            {/* Show Permissions if the user is superadmin or admin */}
            {RolesUser && (
              <FormControl fullWidth margin="dense">
                <RHFAutocomplete
                  name="permissions"
                  label="Permissions*"
                  multiple
                  options={permissionList}
                  getOptionLabel={(option) => option?.name || 'No name available'}
                  isOptionEqualToValue={(option, value) => option?.id === value}
                  onChange={(event, value) => {
                    setValue(
                      'permissions',
                      value.map((p) => (typeof p === 'object' ? p.id : p)) // Store permission ids
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.permissions}
                      helperText={errors.permissions?.message}
                      variant="outlined"
                      placeholder="Pilih Permissions*"
                    />
                  )}
                  renderTags={(value, getPermissionProps) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {value?.map((id, index) => {
                        const permission = permissionList.find((p) => p.id === id); // Find permission by id
                        return permission ? (
                          <Chip
                            key={id}
                            label={permission.name}
                            {...getPermissionProps({ index })}
                          />
                        ) : null;
                      })}
                    </Box>
                  )}
                />
              </FormControl>
            )}

            <RHFTextField name="password" label="Password" type="password" />
            <RHFTextField name="confirmPassword" label="Konfirmasi Password" type="password" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Batal
          </Button>

          <Button variant="contained" type="submit" disabled={isPending}>
            {isPending ? 'Memperbarui...' : 'Perbarui'}
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
  instances: PropTypes.array.isRequired,
  onRefetch: PropTypes.func,
};
