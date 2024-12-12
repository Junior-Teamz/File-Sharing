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
import { useCreateTag } from './view/TagMutation'; // Pastikan hook ini sudah benar
import { Button } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useQueryClient } from '@tanstack/react-query';

export default function TagCreateForm() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient()
  const router = useRouter();
  const { mutate: CreateTag, isPending } = useCreateTag({
    onSuccess: () => {
      enqueueSnackbar('Tag berhasil dibuat', { variant: 'success' });
      reset();
      router.push(paths.dashboard.tag.list);
      queryClient.invalidateQueries({ queryKey:['tag.admin']})
    },
    onError: (error) => {
      // Check if the error has the expected structure
      if (error.errors && error.errors.name) {
        // Set form error for the name field
        methods.setError('name', {
          type: 'manual',
          message: error.errors.name[0], // "Instance name already exists."
        });
      } else {
        enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
      }
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
      CreateTag(data);
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
              <RHFTextField name="name" label="Nama Tag" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Button variant="outlined" type="submit">
                {isPending ? 'Buat Tag...' : 'Buat Tag'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

TagCreateForm.propTypes = {
  currentUser: PropTypes.object,
};
