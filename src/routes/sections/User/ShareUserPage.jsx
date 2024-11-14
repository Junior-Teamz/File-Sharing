import { Helmet } from 'react-helmet-async';
import FileManagerView from './shareuser/view/FileManagerView';

export default function ShareUserPage() {
  return (
    <>
      <Helmet>
        <title>Shared With Me - File Sharing</title>
      </Helmet>

      <FileManagerView/>
    </>
  );
}
