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
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Button, MenuItem } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateSection } from './view/sectionsFetch';
import { useIndexInstance } from '../instancepages/view/Instance';

export default function SectionForm() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: instances, isLoading } = useIndexInstance();

  // Validasi menggunakan Yup
  const NewSectionSchema = Yup.object().shape({
    instance_id: Yup.string().required('Instance ID is required'),
    name: Yup.string().required('Name is required').max(100, 'Name must be at most 100 characters'),
  });

  const methods = useForm({
    resolver: yupResolver(NewSectionSchema),
    defaultValues: {
      instance_id: '', // Tambahkan instance_id sebagai field
      name: '',
    },
  });

  const { reset, handleSubmit, setError } = methods;

  const { mutate: CreateSection, isPending } = useCreateSection({
    onSuccess: () => {
      enqueueSnackbar('Unit Kerja berhasil dibuat', { variant: 'success' });
      reset();
      router.push(paths.dashboard.section.list);
      queryClient.invalidateQueries({ queryKey: ['list.section'] });
    },
    onError: (error) => {
      if (error.errors) {
        if (typeof error.errors === 'string') {
          enqueueSnackbar(`Error: ${error.errors}`, { variant: 'error' });
        } else {
          Object.keys(error.errors).forEach((key) => {
            setError(key, {
              type: 'manual',
              message: error.errors[key][0],
            });
          });
        }
      } else {
        enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
      }
    },
  });

  const onSubmit = async (data) => {
    try {
      CreateSection(data);
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
              <RHFSelect name="instance_id" label="Instansi" disabled={isLoading}>
                {isLoading ? (
                  <MenuItem value="">Loading...</MenuItem>
                ) : (
                  instances.data?.map((instance) => (
                    <MenuItem key={instance.id} value={instance.id}>
                      {instance.name}
                    </MenuItem>
                  ))
                )}
              </RHFSelect>

              <RHFTextField name="name" label="Nama Unit Kerja" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Button variant="contained" type="submit" disabled={isPending}>
                {isPending ? 'Buat Unit Kerja...' : 'Buat Unit Kerja'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

SectionForm.propTypes = {
  currentUser: PropTypes.object,
};
