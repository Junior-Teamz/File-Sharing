import { Helmet } from 'react-helmet-async';
import TagCreateView from 'src/sections/tag/view/TagCreateView';

// sections

// ----------------------------------------------------------------------

export default function create() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new instance</title>
      </Helmet>

      <TagCreateView />
    </>
  );
}
