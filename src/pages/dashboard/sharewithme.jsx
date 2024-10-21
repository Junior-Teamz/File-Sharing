import { Helmet } from 'react-helmet-async';
// sections
import { FileManagerView } from 'src/sections/sharewithme/view';

// ----------------------------------------------------------------------

export default function ShareWithMe() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Share With Me</title>
      </Helmet>

      <FileManagerView />
    </>
  );
}
