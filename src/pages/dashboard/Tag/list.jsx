import { Helmet } from 'react-helmet-async';
// sections
import TagListView from 'src/sections/tag/view/TagListView';

// ----------------------------------------------------------------------

export default function list() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Daftar Tag</title>
      </Helmet>

     <TagListView/>
    </>
  );
}
