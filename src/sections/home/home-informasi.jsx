import { Box } from '@mui/material';
import Hero from './hero-information';
import What from './what-information';


export default function HomeInformasi() {
  return (
    <>
      {/* <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'primary.main',
        color: 'common.white',
      }}
    ></Box> */}
      <Hero />
      <What />
    </>
  );
}
