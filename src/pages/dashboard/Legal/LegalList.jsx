import { Helmet } from 'react-helmet-async';
import LegalListView from 'src/sections/legalbasis/view/LegalListView';
// sections

// ----------------------------------------------------------------------

export default function LegalList() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Daftar Dasar Hukum</title>
      </Helmet>

     <LegalListView/>
    </>
  );
}
