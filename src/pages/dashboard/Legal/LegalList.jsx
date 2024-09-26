import { Helmet } from 'react-helmet-async';
import LegalListView from 'src/sections/legalbasis/view/LegalListView';
// sections

// ----------------------------------------------------------------------

export default function LegalList() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Legal List</title>
      </Helmet>

     <LegalListView/>
    </>
  );
}
