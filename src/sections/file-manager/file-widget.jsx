import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
// utils
import { fData } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function FileWidget({ title, value, icon, sx, loading, ...other }) {
  const progressValue = value ? Math.min((value / 1000000000) * 100, 100) : 0;

  return (
    <Box sx={{ p: 3, ...sx }} {...other}>
      <Typography variant="h6" sx={{ mt: 3 }}>
        {title}
      </Typography>

      {loading ? ( // Display loading spinner if loading is true
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              my: 2,
              height: 6,
              '&::before': {
                bgcolor: 'divider',
                opacity: 1,
              },
            }}
          />

          <Stack
            direction="row"
            spacing={0.5}
            justifyContent="flex-end"
            sx={{ typography: 'subtitle2' }}
          >
            <Box
              sx={{
                mr: 0.5,
                typography: 'body2',
                color: 'text.disabled',
              }}
            >
              Digunakan {fData(value)}
            </Box>
            / Dari <AllInclusiveIcon />
          </Stack>
        </>
      )}
    </Box>
  );
}

FileWidget.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  loading: PropTypes.bool, // Add a new prop for loading state
};

FileWidget.defaultProps = {
  loading: false, // Default value for loading is false
};
