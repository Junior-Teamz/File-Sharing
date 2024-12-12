import * as Yup from 'yup';
import { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/system/Unstable_Grid/Grid';
import Typography from '@mui/material/Typography';
// hooks
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import { useEditUser } from '../user/view/UserManagement';
import { fData } from 'src/utils/format-number';
import { AuthContext } from 'src/auth/context/jwt/auth-context';
import { useAuthContext } from 'src/auth/hooks';
import { CircularProgress, Container } from '@mui/material';

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext(AuthContext);
  const userId = user?.id;

  const [loading, setLoading] = useState(true);

  const { mutateAsync: editUser } = useEditUser({
    onSuccess: (updatedUser) => {
      enqueueSnackbar('User berhasil diperbarui', { variant: 'success' });
      resetForm({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        instance: updatedUser.instances || [],
        photo_profile_url: updatedUser.photo_profile_url || '',
      });
    },
    onError: (error) => {
      enqueueSnackbar('Gagal memperbarui user', { variant: 'error' });
      console.error('Error update user:', error);
    },
  });

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Nama wajib diisi'),
    email: Yup.string().email('Format email tidak valid').required('Email wajib diisi'),
    instance: Yup.array().nullable(),
    photo_profile_url: Yup.string().nullable(),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      instance: [],
      photo_profile_url: '',
    },
  });

  const {
    reset: resetForm,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (user) {
      resetForm({
        name: user.name || '',
        email: user.email || '',
        instance: user.instances || [],
        photo_profile_url: user.photo_profile_url?.path || '',
      });
    }
    setLoading(false);
  }, [user, resetForm]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('instance', JSON.stringify(data.instance));
    formData.append('_method', 'PUT');

    if (data.photo_profile) {
      formData.append('photo_profile', data.photo_profile);
    }

    try {
      const response = await editUser({ userId, data: formData });
      enqueueSnackbar('User berhasil diperbarui', { variant: 'success' });
      resetForm({
        name: response.name || '', 
        email: response.email || '',
        instance: response.instances || [],
        photo_profile_url: response.photo_profile_url || '',
      });
    } catch (error) {
      enqueueSnackbar('Gagal memperbarui user', { variant: 'error' });
      console.error('Error update user:', error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validFormats.includes(file.type)) {
          enqueueSnackbar('Format file tidak didukung', { variant: 'error' });
          return;
        }

        if (file.size > 3000000) {
          enqueueSnackbar('Ukuran file terlalu besar (maks 3MB)', { variant: 'error' });
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setValue('photo_profile_url', reader.result, { shouldValidate: true });
        };
        reader.readAsDataURL(file);

        setValue('photo_profile', file, { shouldValidate: true });
      }
    },
    [setValue, enqueueSnackbar]
  );

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
          <CircularProgress />
        </Grid>
      </Container>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photo_profile_url"
              maxSize={3000000}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png,
                  <br /> max size of {fData(3000000)}
                </Typography>
              }
              preview={methods.watch('photo_profile_url')}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
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
              <RHFTextField name="name" label="Nama" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField
                name="instance"
                label="Instansi"
                disabled
                value={(user.instances || []).map((instansi) => instansi.name).join(', ')}
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Simpan
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
