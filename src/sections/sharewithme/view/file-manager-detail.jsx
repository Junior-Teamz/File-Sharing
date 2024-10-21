import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Typography } from '@mui/material';
import { Box, Container, Stack } from '@mui/system';
import InfoIcon from '@mui/icons-material/Info';
import { enqueueSnackbar } from 'notistack';
import FileRecentItem from '../file-recent-item';
import EmptyContent from 'src/components/empty-content';
import { paths } from 'src/routes/paths';
import { fetchDetail } from '../fetchShare';

export const FIleManagerDetaill = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, refetch, error } = fetchDetail(id);

  const [folderStack, setFolderStack] = useState([]);

  const handleSubfolderClick = useCallback(
    (folderId, folderName) => {
      setFolderStack((prev) => [...prev, { id, name: data.folder_info.name }]); // Save current folder id and name in stack
      navigate(`/dashboard/file-manager/info/${folderId}`, { replace: true });
    },
    [navigate, id, data]
  );

  const handleInfoClick = () => {
    if (data && data.folder_info) {
      enqueueSnackbar(`Folder ID: ${data.folder_info.folder_id}`, { variant: 'info' });
    } else {
      enqueueSnackbar('Folder data is not available.', { variant: 'warning' });
    }
  };

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching folder details.</div>;
  }

  if (tagsError) {
    return <div>Error fetching tags.</div>;
  }

  return (
    <>
      <Container>
        <Box sx={{ my: 5 }}>
          <Typography variant="h6">
            <span
              style={{
                cursor: 'pointer',
                color: 'rgba(0, 0, 0, 0.5)',
                textDecoration: 'underline',
                marginRight: '8px',
              }}
              onClick={() => navigate(paths.dashboard.root)}
            >
              My Drive &raquo;
            </span>

            {folderStack.map((folder, index) => (
              <span
                key={folder.id}
                style={{
                  cursor: 'pointer',
                  color: 'rgba(0, 0, 0, 0.5)',
                  textDecoration: 'underline',
                  marginRight: '8px',
                }}
                onClick={() => {
                  const newStack = folderStack.slice(0, index);
                  setFolderStack(newStack);
                  navigate(`/dashboard/file-manager/info/${folder.id}`, { replace: true });
                }}
              >
                {folder.name} &raquo;
              </span>
            ))}

            <span style={{ color: 'black' }}>{data.folder_info.name}</span>

            <InfoIcon
              fontSize="medium"
              sx={{ mt: 3, cursor: 'pointer' }}
              onClick={handleInfoClick}
            />
          </Typography>
        </Box>

        {data.subfolders.length === 0 && data.files.length === 0 ? (
          <>
            <EmptyContent filled title="No Content" sx={{ py: 10 }} />
          </>
        ) : (
          <>
            <Typography sx={{ mb: 2, mt: 10 }}>Subfolders</Typography>
            {data.subfolders.map((folder) => (
              <div key={folder.id} onClick={() => handleSubfolderClick(folder.id, folder.name)}>
                <FileRecentItem
                  file={{ ...folder, type: 'folder' }}
                  onRefetch={refetch}
                  onDelete={() => console.info('DELETE', folder.id)}
                />
              </div>
            ))}

            {data.files.length > 0 && (
              <Stack spacing={2} sx={{ mt: 5 }}>
                <Typography sx={{ mb: 2, mt: 5 }}>Files</Typography>
                {data.files.map((file) => (
                  <FileRecentItem
                    key={file.id}
                    file={file}
                    onRefetch={refetch}
                    onDelete={() => console.info('DELETE', file.id)}
                  />
                ))}
              </Stack>
            )}
          </>
        )}
      </Container>
    </>
  );
};
