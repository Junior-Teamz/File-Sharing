// src/sections/account/account-general.js
import * as Yup from 'yup';
import { useCallback, useContext } from 'react';
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
import { AuthContext } from 'src/auth/context/jwt';
import { useEditUser } from '../user/view/UserManagement';
import { fData } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function AccountGeneral({ userId }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user, refetchUserData } = useContext(AuthContext);
  const { mutate: editUser, isPending } = useEditUser({
    onSuccess: () => {
      enqueueSnackbar('User berhasil di perbarui', { variant: 'success' });
      methods.reset({
        displayName: '',
        email: '',
        instance_id: '',
        photoURL: '',
      });

      refetchUserData();
      useClient.invalidateQueries({ queryKey: ['list.user'] });
    },
    onError: (error) => {
      enqueueSnackbar('Gagal memperbarui user', { variant: 'error' });
      console.error('Error update user', error);
    },
  });

  const instances = user?.instances?.map((instansi) => instansi.name);

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().nullable(),
    email: Yup.string().nullable(),
    instance: Yup.array().nullable(),
    photoURL: Yup.mixed().nullable(),
  });

  const defaultValues = {
    displayName: user?.name || null,
    email: user?.email || null,
    instance: user?.instances || null, // Make it nullable
    photoURL: user?.photo_profile_url || null,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updatedData = {
        ...data,
        user_id: userId, // Gunakan userId dari props
      };
      await editUser(updatedData);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
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
            />
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
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
              <RHFTextField name="displayName" label="Nama" />
              <RHFTextField name="email" label="Email" />
              {/* Disable instance field */}
              <RHFTextField
                name="instance"
                label="Instansi"
                disabled
                value={instances?.join(', ')}
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Simpan perubahan
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
