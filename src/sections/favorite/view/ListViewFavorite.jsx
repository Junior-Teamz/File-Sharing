import React, { useState } from 'react';
import { Grid, TextField, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useGetFavorite, useGetFolderFavorite } from './fetchFavorite';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export default function ListViewFavorite() {
  const { data: files, isError: errorFiles, isFetching: fetchingFiles, isLoading: loadingFiles } = useGetFavorite();
  const { data: folders, isError: errorFolders, isFetching: fetchingFolders, isLoading: loadingFolders } = useGetFolderFavorite();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logic for search
  const filteredFiles = files?.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredFolders = folders?.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loadingFiles || loadingFolders) return <CircularProgress />;

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Search bar */}
      <TextField
        fullWidth
        variant="outlined"
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: '20px' }}
      />

      {/* Handle Errors */}
      {(errorFiles || errorFolders) && (
        <Alert severity="error">
          {errorFiles ? "No favorite files found." : null}
          {errorFolders ? "No favorite folders found." : null}
        </Alert>
      )}

      {/* Folder Section */}
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        Folders
      </Typography>
      {fetchingFolders ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {filteredFolders?.length > 0 ? (
            filteredFolders.map((folder) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={folder.id}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <FolderIcon sx={{ fontSize: 40 }} />
                  <Typography variant="body1">{folder.name}</Typography>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography>No folders found</Typography>
          )}
        </Grid>
      )}

      {/* File Section */}
      <Typography variant="h6" sx={{ margin: '20px 0 10px' }}>
        Files
      </Typography>
      {fetchingFiles ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {filteredFiles?.length > 0 ? (
            filteredFiles.map((file) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <InsertDriveFileIcon sx={{ fontSize: 40 }} />
                  <Typography variant="body1">{file.name}</Typography>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography>No files found</Typography>
          )}
        </Grid>
      )}
    </Box>
  );
}
