import { Helmet } from 'react-helmet-async';

// sections
import InstanceCreateView from 'src/sections/instancepages/view/InstanceCreateView';

// ----------------------------------------------------------------------

export default function create() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new instance</title>
      </Helmet>

      <InstanceCreateView />
    </>
  );
}
