import { Helmet } from 'react-helmet-async';
import TagCreateView from 'src/sections/tag/view/TagCreateView';

// sections

// ----------------------------------------------------------------------

export default function create() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Buat Tag Baru</title>
      </Helmet>

      <TagCreateView />
    </>
  );
}
