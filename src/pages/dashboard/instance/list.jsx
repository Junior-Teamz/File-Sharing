import { Helmet } from 'react-helmet-async';
// sections
import InstanceListView from 'src/sections/instancepages/view/InstanceListView';

// ----------------------------------------------------------------------

export default function list() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Daftar Instansi</title>
      </Helmet>

     <InstanceListView/>
    </>
  );
}
