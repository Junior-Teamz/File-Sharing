import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/system/Unstable_Grid/Grid';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Button } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useCreateTagNews } from './view/fetchNewsTag';

export default function TagNewsCreateForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { mutate: CreateTag, isPending } = useCreateTagNews({
    onSuccess: () => {
      enqueueSnackbar('Tag berhasil dibuat', { variant: 'success' });
      reset(); // Reset form setelah sukses
      router.push(paths.dashboard.TagNews.list); // Redirect ke halaman list
    },
    onError: (error) => {
      enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
      // Tetap di halaman create tanpa redirect
    },
  });

  // Validasi menggunakan Yup
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(100, 'Name must be at most 100 characters'),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: {
      name: '',
    },
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = async (data) => {
    try {
      CreateTag(data); // Mutate untuk memproses pembuatan tag
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
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
              <RHFTextField name="name" label="Full Name" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton variant="contained" type="submit" loading={isPending}>
                Create Tag
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

TagNewsCreateForm.propTypes = {
  currentUser: PropTypes.object,
};
