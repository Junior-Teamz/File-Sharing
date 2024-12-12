import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSettingsContext } from 'src/components/settings';
//
import Main from './main';
import Header from './Header';
import NavMini from './NavMini';
import NavVertical from './NavVertical';
import NavHorizontal from './NavHorizontal';
import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function DashboardUserLayout({ children }) {
  const settings = useSettingsContext();
  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  if (isHorizontal) {
    return (
      <>
      <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>
      </>
    );
  }

  return (
    <>
     <Box
          sx={{
            ...bgGradient({
              color: alpha(
                theme.palette.background.paper,
                theme.palette.mode === 'light' ? 0.8 : 0.8
              ),
              imgUrl: '/assets/background/overlay_3.jpg',
            }),
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            position: 'absolute',
            filter: 'blur(20px)',
            WebkitFilter: 'blur(20px)',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        />
      <Header onOpenNav={nav.onTrue} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {renderNavVertical}

        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardUserLayout.propTypes = {
  children: PropTypes.node,
};
