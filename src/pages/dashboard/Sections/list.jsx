import { Helmet } from 'react-helmet-async';
// sections
import SectionListView from 'src/sections/Section/view/SectionListView';

// ----------------------------------------------------------------------

export default function List() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Daftar Unit Kerja</title>
      </Helmet>

     <SectionListView/>
    </>
  );
}
