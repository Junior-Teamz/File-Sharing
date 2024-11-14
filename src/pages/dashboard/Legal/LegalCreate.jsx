import { Helmet } from 'react-helmet-async';
import LegalCreateView from 'src/sections/legalbasis/view/LegalCreateView';

// ----------------------------------------------------------------------

export default function LegalCreate() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Buat Dasar Hukum Baru</title>
      </Helmet>

      <LegalCreateView />
    </>
  );
}
