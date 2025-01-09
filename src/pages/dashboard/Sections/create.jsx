import { Helmet } from 'react-helmet-async';
// sections
import SectionCreateView from 'src/sections/Section/view/SectionCreateView';

// ----------------------------------------------------------------------

export default function Create() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Daftar Unit Kerja</title>
      </Helmet>

     <SectionCreateView/>
    </>
  );
}
