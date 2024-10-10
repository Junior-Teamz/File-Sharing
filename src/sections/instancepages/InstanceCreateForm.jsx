import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/system/Unstable_Grid/Grid';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useCreateInstance } from './view/Instance'; // Pastikan hook ini sudah benar
import { Button } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useQueryClient } from '@tanstack/react-query';

export default function InstanceCreateForm() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: CreateInstance, isPending } = useCreateInstance({
    onSuccess: () => {
      enqueueSnackbar('Instansi berhasil dibuat', { variant: 'success' });
      reset();
      router.push(paths.dashboard.instance.list);
      queryClient.invalidateQueries({ queryKey: ['list.instansi'] });
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

    address: Yup.string()
      .required('Address is required')
      .max(100, 'Address must be at most 100 characters'),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: {
      name: '',
      address: '',
    },
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = async (data) => {
    try {
      CreateInstance(data);
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

              <RHFTextField name="address" label="Address" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Button variant="outlined" type="submit">
                {isPending ? 'Creating Instansi...' : 'Create Instansi'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

InstanceCreateForm.propTypes = {
  currentUser: PropTypes.object,
};
