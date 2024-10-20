import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
// routes
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function FolderPanel({
  title,
  subTitle,
  link,
  onOpen,
  collapse,
  onCollapse,
  showMore,
  setShowMore,
  noFolders, // New prop to indicate if there are no folders
  sx,
  ...other
}) {
  return (
    <Stack direction="row" alignItems="center" sx={{ mb: 3, ...sx }} {...other}>
      <Stack flexGrow={1}>
        <Stack direction="row" alignItems="center" spacing={1} flexGrow={1}>
          <Typography variant="h6"> {title} </Typography>
        </Stack>

        <Box sx={{ typography: 'body2', color: 'text.disabled', mt: 0.5 }}>{subTitle}</Box>

        {/* Display "Not Found" message if no folders are available */}
        {noFolders && (
          <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
            Not Found
          </Typography>
        )}
      </Stack>

      {link && (
        <Button
          href={link}
          component={RouterLink}
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          View All
        </Button>
      )}

      {onCollapse && (
        <IconButton onClick={onCollapse}>
          <Iconify icon={collapse ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-upward-fill'} />
        </IconButton>
      )}

      {/* View More / View Less Button */}
      {onOpen && (
        <Button
          size="small"
          color="inherit"
          onClick={onOpen}
          sx={{ ml: 1 }}
        >
          {showMore ? 'View Less' : 'View More'}
        </Button>
      )}
    </Stack>
  );
}

FolderPanel.propTypes = {
  collapse: PropTypes.bool,
  link: PropTypes.string,
  onCollapse: PropTypes.func,
  onOpen: PropTypes.func,
  subTitle: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.string,
  showMore: PropTypes.bool, // New prop to manage "View More / View Less" state
  setShowMore: PropTypes.func, // New prop to manage the showMore state
  noFolders: PropTypes.bool, // New prop to indicate if there are no folders
};
