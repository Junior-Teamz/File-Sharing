import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// routes
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email harus di isi').email('Email harus email yang valid'),
    password: Yup.string().required('Password harus di isi'),
  });

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await login?.(data.email, data.password);
  
      const userRoles = response?.roles;
      const isSuperadmin = response?.is_superadmin ?? false;
  
      if (userRoles?.includes('admin') || isSuperadmin) {
        router.push('/dashboard');
      } else if (userRoles?.includes('user')) {
        router.push('/dashboarduser');
      } else {
        enqueueSnackbar('Role tidak dikenal!', { variant: 'error' });
      }
  
      enqueueSnackbar('Login Berhasil!', { variant: 'success' });
    } catch (error) {
      console.error('Login Error:', error);
      reset();
  
      // Menangani pesan kesalahan spesifik
      if (error.response && error.response.data.errors) {
        // Cek apakah errors adalah string atau objek
        if (typeof error.response.data.errors === 'string') {
          setErrorMsg(error.response.data.errors);
        } else if (typeof error.response.data.errors === 'object') {
          // Ambil pesan kesalahan dari objek
          setErrorMsg(Object.values(error.response.data.errors).join(', '));
        }
      } else {
        setErrorMsg('Tidak bisa login! Silakan coba lagi.');
      }
  
      // Pastikan menampilkan snackbar setelah setErrorMsg
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  });
  

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in to File Sharing</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="email" label="Email address" />

      <RHFTextField
        name="password"
        label="Password"
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
      />

      <Link
        component={RouterLink}
        href="/forgot-password"
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end' }}
      >
        Forgot password?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>

      <Link
        component={RouterLink}
        href="/"
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end' }}
      >
        Kembali ke home
      </Link>
    </Stack>
  );

  return (
    <FormProvider
      methods={methods}
      onSubmit={onSubmit}
      sx={{
        background: 'linear-gradient(196deg, #2c7810, #2b9c1f, #24c22f, #08e93f)',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {renderHead}
      {renderForm}
    </FormProvider>
  );
}
