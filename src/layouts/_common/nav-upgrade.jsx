import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// locales
import { useLocales } from 'src/locales';
// components
import FileWidget from 'src/sections/file-manager/file-widget';
import { storage } from './useFetchStorage';
import { CircularProgress, Box } from '@mui/material'; // Added Box for styling

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { user } = useMockedUser();
  const { data, isLoading, isFetching } = storage(); // Mengambil data penyimpanan, assuming `isLoading` is available
  const { t } = useLocales();

  if (isLoading || isFetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <FileWidget title="Penyimpanan" value={data?.formattedSize} />
      </Stack>
    </Stack>
  );
}
