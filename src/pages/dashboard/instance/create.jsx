import { Helmet } from 'react-helmet-async';

// sections
import InstanceCreateView from 'src/sections/instancepages/view/InstanceCreateView';

// ----------------------------------------------------------------------

export default function create() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Buat Instansi Baru</title>
      </Helmet>

      <InstanceCreateView />
    </>
  );
}
