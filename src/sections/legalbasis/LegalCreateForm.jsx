import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/system/Unstable_Grid/Grid';
import Typography from '@mui/material/Typography';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Button } from '@mui/material';
import { useCreateLegal } from './view/fetchLegalBasis';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useQueryClient } from '@tanstack/react-query';

export default function LegalCreateForm() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: createLegal, isPending } = useCreateLegal({
    onSuccess: () => {
      enqueueSnackbar('Dasar hukum berhasil dibuat', { variant: 'success' });
      reset();
      router.push(paths.dashboard.legal.list);
      queryClient.invalidateQueries({ queryKey: ['legal.admin'] });
    },
    onError: (error) => {
      if (error.errors && error.errors.name) {
        methods.setError('name', {
          type: 'manual',
          message: error.errors.name[0],
        });
      } else {
        enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
      }
    },
  });

  const methods = useForm({
    defaultValues: {
      name: '',
      file: null,
    },
  });

  const { reset, handleSubmit, setValue, watch } = methods;

  const file = watch('file');

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('file', data.file);

    if (!data.file) {
      enqueueSnackbar('File harus di isi', { variant: 'error' });
      return;
    }

    const fileSize = data.file.size;
    const fileType = data.file.type;
    if (fileSize > 5000000) {
      enqueueSnackbar('maxsimal ukuran file 5MB', { variant: 'error' });
      return;
    }
    if (
      ![
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ].includes(fileType)
    ) {
      enqueueSnackbar('File harus berupa PDF, DOC, atau DOCX', { variant: 'error' });
      return;
    }

    try {
      createLegal(formData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    setValue('file', e.target.files[0], { shouldValidate: true });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
              buat dasar hukum baru
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary" >
              Harap berikan nama dan unggah dokumen yang valid(PDF, DOC, DOCX).
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
             Maximal Ukuran File 5 Mb
            </Typography>

            <Box
              display="grid"
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Nama Dokumen" />

              {/* File upload with icon */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button variant="outlined" component="label" sx={{ flexGrow: 1 }}>
                  Upload File
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {file && <Typography variant="body2">{file.name}</Typography>}
              </Box>
            </Box>

            {/* Action buttons */}
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 4 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={isPending}
                sx={{ minWidth: '150px' }}
              >
                {isPending ? 'Membuat...' : 'Buat Dasar Hukum'}
              </LoadingButton>
              <Button
                variant="outlined"
                color="error"
                onClick={() => reset()}
                sx={{ minWidth: '150px' }}
              >
                Riset form
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

LegalCreateForm.propTypes = {
  currentUser: PropTypes.object,
};
