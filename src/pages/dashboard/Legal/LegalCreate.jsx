import { Helmet } from 'react-helmet-async';
import LegalCreateView from 'src/sections/legalbasis/view/LegalCreateView';


// sections

// ----------------------------------------------------------------------

export default function LegalCreate() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new instance</title>
      </Helmet>

      <LegalCreateView />
    </>
  );
}
