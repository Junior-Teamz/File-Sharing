import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import InstanceEditView from 'src/sections/instancepages/view/InstanceEditView';

// ----------------------------------------------------------------------

export default function edit() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Instance Edit</title>
      </Helmet>

      <InstanceEditView id={`${id}`} />
    </>
  );
}
