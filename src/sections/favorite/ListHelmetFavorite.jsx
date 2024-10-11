import { Helmet } from 'react-helmet-async';
// sections
import ListViewFavorite from './view/ListViewFavorite';

// ----------------------------------------------------------------------

export default function ListHelmetFavorite() {
  return (
    <>
      <Helmet>
        <title> Dashboard: List Favorite</title>
      </Helmet>
    
      <ListViewFavorite />
    </>
  );
}
