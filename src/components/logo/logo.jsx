import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { RouterLink } from 'src/routes/components';
import kemen from '../../../public/logo/kemen1.png';

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <Box component="img" src={kemen} alt="Logo" sx={{ width: '100%', height: '100%' }} />
      <svg width="0" height="0" style={{ position: 'absolute', visibility: 'hidden' }}>
        <defs>
          <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor={theme.palette.primary.dark} />
            <stop offset="100%" stopColor={theme.palette.primary.main} />
          </linearGradient>
          <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={theme.palette.primary.light} />
            <stop offset="100%" stopColor={theme.palette.primary.main} />
          </linearGradient>
          <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={theme.palette.primary.light} />
            <stop offset="100%" stopColor={theme.palette.primary.main} />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
