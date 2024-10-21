import { Helmet } from 'react-helmet-async';
import FileManagerView from './favoriteuser/view/FileManagerView';

export default function FavoritePage() {
  return (
    <>
      <Helmet>
        <title>Favorite - File Sharing</title>
      </Helmet>

      <FileManagerView/>
    </>
  );
}
