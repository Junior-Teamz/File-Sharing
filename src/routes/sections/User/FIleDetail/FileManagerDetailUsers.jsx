import { Box, Container } from '@mui/system';
import React from 'react';
import { useParams } from 'react-router';
import { useFetchDetailFolderUsers } from '../DriveUser/view/FetchFolderUser/useFetchDetailFolderUser';

const FileManagerDetailUsers = () => {
  const { id } = useParams();
  const { data } = useFetchDetailFolderUsers(id);
  return (
    <>
      <Container>
        <Box>FileManager DetailUsers dengan id berikut {id}</Box>
      </Container>
    </>
  );
};

export default FileManagerDetailUsers;
