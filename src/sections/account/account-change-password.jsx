import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { AuthContext } from 'src/auth/context/jwt/auth-context';
import { useAuthContext } from 'src/auth/hooks';
import { useUpdatePassword } from 'src/routes/sections/User/DriveUser/view/Profile/useUpdatePassword';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext(AuthContext);
  const userId = user?.id;

  const password = useBoolean();

  const ChangePassWordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('Password baru harus di isi')
      .min(8, 'Password minimal 8 karakter'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Password tidak sama')
      .required('Konfirmasi password harus di isi'),
  });

  const defaultValues = {
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutateAsync: updatePassword } = useUpdatePassword({
    onSuccess: () => {
      enqueueSnackbar('Password berhasil diperbarui!', { variant: 'success' });
      reset();
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar('Gagal memperbarui password', { variant: 'error' });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log('Form Data:', data); // Tambahkan ini untuk debugging
    try {
      const payload = {
        userId,
        password: data.newPassword,
        password_confirmation: data.confirmNewPassword,
      };

      console.log('Payload:', payload); // Cek apakah payload sudah sesuai

      await updatePassword(payload);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Terjadi kesalahan', { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <RHFTextField
          name="newPassword"
          label="Password baru"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password minimal 8
              karakter
            </Stack>
          }
        />

        <RHFTextField
          name="confirmNewPassword"
          type={password.value ? 'text' : 'password'}
          label="Konfirmasi password baru"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          onSubmit={onSubmit}
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ ml: 'auto' }}
        >
          Simpan Perubahan
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
