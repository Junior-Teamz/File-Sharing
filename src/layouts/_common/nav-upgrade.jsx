// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// locales
import { useLocales } from 'src/locales';
// components
import FileWidget from 'src/sections/file-manager/file-widget';
import { storage } from './useFetchStorage';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { user } = useMockedUser();
  const { data } = storage(); // Mengambil data penyimpanan
  const { t } = useLocales();

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <FileWidget
          value={data?.formattedSize} 
        />
      </Stack>
    </Stack>
  );
}
