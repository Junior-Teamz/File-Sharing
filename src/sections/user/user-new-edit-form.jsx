import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/system/Unstable_Grid/Grid';
import FormProvider, { RHFTextField, RHFSelect, RHFAutocomplete } from 'src/components/hook-form';
import { useCreateUser, usePermissionAdmin } from './view/UserManagement';
import { Button, Chip, FormControl, MenuItem, TextField } from '@mui/material';
import { useIndexInstance } from '../instancepages/view/Instance';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useGetSection } from '../Section/view/sectionsFetch';

export default function UserNewEditForm({ currentUser }) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: instanceList, isLoading: isLoadingInstance } = useIndexInstance();
  const { data: permissionList = [], isLoading: isLoadingPermission } = usePermissionAdmin();
  console.log(permissionList);
  const { data: instanceSections = [], isLoading: isLoadingSection } = useGetSection();

  const { mutate: CreateUser, isPending } = useCreateUser({
    onSuccess: () => {
      enqueueSnackbar('User berhasil dibuat', { variant: 'success' });
      reset();
      router.push(paths.dashboard.user.list);
      queryClient.invalidateQueries({ queryKey: ['list.user'] });
    },
    onError: (error) => {
      if (error.errors && error.errors.email) {
        methods.setError('email', {
          type: 'manual',
          message: error.errors.email[0],
        });
      } else {
        enqueueSnackbar(`Error: ${error.errors}`, { variant: 'error' });
      }
    },
  });

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

  const NewUserSchema = Yup.object().shape({
    name: Yup.string()
      .required('Nama harus di isi')
      .max(100, 'Name must be at most 100 characters'),
    instance_id: Yup.string().required('Instansi harus di isi'),
    email: Yup.string()
      .required('Email harus di isi')
      .email('Email harus berupa alamat email yang valid')
      .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Invalid email format')
      .test('is-valid-domain', 'Invalid email domain', (value) => {
        const domain = value ? value.split('@')[1] : '';
        return allowedDomains.includes(domain);
      }),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    role: Yup.string()
      .required('Role is required')
      .oneOf(['admin', 'user'], 'Role must be either admin or user'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      password: '',
      confirmPassword: '',
      role: currentUser?.role || '',
      instance_id: currentUser?.instansiId || '',
      instance_section_id: currentUser?.instance_section_id || '',
    //   permissions: Array.isArray(currentUser?.permissions)
    //     ? currentUser.permissions.map((p) => p.id)
    //     : [],
    // }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    refetch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;
  const selectedRole = useWatch({ control: methods.control, name: 'role' });

  const onSubmit = async (data) => {
    const {
      confirmPassword,
      photo_profile,
      instance_id,
      instance_section_id,
      permissions,
      ...restData
    } = data;

    const validInstanceId = instance_id ? instance_id : null;
    //     const validInstanceSectionId =
    //       instance_section_id && instance_section_id !== '0' ? instance_section_id : null;
    // console.log(validInstanceSectionId)
    const formData = new FormData();
    Object.keys(restData).forEach((key) => {
      if (Array.isArray(restData[key])) {
        restData[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, restData[key]);
      }
    });

    // formData.append('permissions', JSON.stringify(data.permissions)); // Menggunakan nama-nama permission
    // permissions.forEach((permission) => {
    //   formData.append('permissions[]', permission);
    // });

    if (validInstanceId) {
      formData.append('instance_id', validInstanceId);
    }

    formData.append('instance_section_id', instance_section_id);
    console.log('instance_section_id:', instance_section_id);

    formData.append('password_confirmation', confirmPassword);

    // Submit the form data
    CreateUser(formData);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Nama*" />
              <RHFTextField name="email" label="Email*" />
              <RHFTextField name="password" label="Password*" type="password" />
              <RHFTextField name="confirmPassword" label="Konfirmasi Password*" type="password" />
              <RHFSelect name="role" label="Role*">
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </RHFSelect>
              {selectedRole === 'user' && (
                <RHFSelect name="instance_id" label="Instansi*" disabled={isLoadingInstance}>
                  {!isLoadingInstance &&
                    instanceList?.data?.map((instance) => (
                      <MenuItem key={instance.id} value={instance.id}>
                        {instance.name}
                      </MenuItem>
                    ))}
                </RHFSelect>
              )}

              {selectedRole === 'user' && (
                <RHFSelect
                  name="instance_section_id"
                  label="Unit Kerja*"
                  disabled={isLoadingSection}
                >
                  {!isLoadingSection &&
                    Array.isArray(instanceSections) &&
                    instanceSections.map((section) => (
                      <MenuItem key={section.id} value={section.id}>
                        {section.nama}
                      </MenuItem>
                    ))}
                </RHFSelect>
              )}

              {/* {selectedRole === 'admin' && (
                <FormControl fullWidth margin="dense">
                  <RHFAutocomplete
                    name="permissions"
                    label="Permissions*"
                    multiple
                    options={permissionList}
                    getOptionLabel={(option) => option?.name || 'No name available'}
                    isOptionEqualToValue={(option, value) => option.id === value}
                    onChange={(event, value) => {
                      setValue(
                        'permissions',
                        value.map((p) => p?.id || p) // Pastikan hanya ID yang dikirim
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
              )} */}
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Button variant="contained" type="submit">
                {isPending ? 'Membuat User...' : 'Buat User'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
