import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// assets
import { PasswordIcon } from 'src/assets/icons';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useForgotPassword } from './useForgotPassword';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function ClassicForgotPasswordView() {
  const { enqueueSnackbar } = useSnackbar();
  const [isDisabled, setIsDisabled] = useState(false);
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email harus di isi')
      .email('Email harus berupa alamat email yang valid'),
  });

  const { mutate: sendLink } = useForgotPassword({
    onSuccess: () => {
      enqueueSnackbar('Permintaan berhasil dikirim', { variant: 'success' });
    },
    onError: (error) => {
      if (error.message) {
        enqueueSnackbar(error.message, { variant: 'warning' });
      } else if (error.errors && error.errors.email) {
        methods.setError('email', {
          type: 'manual',
          message: error.errors.email[0],
        });
      } else {
        enqueueSnackbar(`${error.message} ${error.retry_after}`, { variant: 'error' });
      }
    },
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onErrorHandler = (error) => {
    if (error.message.includes('Silakan coba lagi dalam')) {
      setIsDisabled(true);
      const retryAfter = parseInt(error.message.match(/\d+/)[0], 10);
      setTimeout(() => setIsDisabled(false), retryAfter * 1000);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      sendLink(data);
    } catch (error) {
      console.error('Submit error:', error);
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={isSubmitting || isDisabled}
      >
        Kirim Permintaan
      </LoadingButton>

      <Link
        component={RouterLink}
        href="/auth/jwt/login"
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Kembali ke login
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Lupa kata sandi?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Silakan masukkan alamat email yang terkait dengan akun Anda dan kami akan mengirimkan
          tautan untuk mengatur ulang kata sandi Anda.
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
