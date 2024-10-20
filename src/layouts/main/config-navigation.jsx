// routes
import { paths } from 'src/routes/paths';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';
import LoginIcon from '@mui/icons-material/Login';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export const navConfig = [
  {
    title: 'Home',
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: '/',
  },
  {
    title: 'Login',
    icon: <LoginIcon fontSize="small" />,
    path: '/auth/jwt/login',
  },
  {
    title: 'Berita',
    icon: <NewspaperIcon fontSize="small" />,
    path: paths.news.informasi,
  },
  {
    title: 'About Us',
    icon: <PeopleIcon fontSize="small" />,
    path: paths.about,
  },
  { title: 'FAQ', 
    icon: <QuizIcon fontSize="small" />,
    path: paths.faqs 
  },
 
];
