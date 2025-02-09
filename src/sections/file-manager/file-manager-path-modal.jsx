import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useMoveFile } from './view/useFolder';
import { useFetchFolder } from '../overview/app/view/folders';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

const FileManagerPathModal = ({ open, onClose, folderName, fileId }) => {
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  // Ambil data folder
  const { data: folderData, isLoading } = useFetchFolder();
  const folders = folderData 
    ? [folderData.root_folder, ...(folderData.subfolders || [])] 
    : [];
  

  // Fungsi untuk memindahkan file
  const { mutateAsync: moveFile, isLoading: isMoving } = useMoveFile({
    onSuccess: () => {
      enqueueSnackbar('File berhasil dipindahkan', { variant: 'success' });
      queryClient.invalidateQueries();
      onClose(); // Tutup modal setelah sukses
    },
    onError: (error) => {
      enqueueSnackbar('Gagal memindahkan file', { variant: 'error' });
      console.error('Error move file:', error);
    },
  });

  // Handle pemindahan file
  const handleMove = async () => {
    if (!selectedFolderId) {
      enqueueSnackbar('Pilih folder tujuan terlebih dahulu', { variant: 'warning' });
      return;
    }
  
    const newFolder = folders.find((folder) => folder.id === selectedFolderId);
    if (!newFolder) {
      enqueueSnackbar('Folder tidak ditemukan', { variant: 'error' });
      return;
    }
  
    console.log('Selected Folder ID:', selectedFolderId);
    console.log('New Folder:', newFolder);
  
    try {
      await moveFile({
        fileId,
        new_folder_id: selectedFolderId, // Pastikan ID folder tujuan dikirim
        path: newFolder.public_path, // Ambil path dari folder tujuan
      });
    } catch (error) {
      console.error('Error saat memindahkan file:', error);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ mb: 2 }}>Pindahkan "{folderName}"</Box>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ minHeight: 0 }}
        >
          <Tab label="Disarankan" sx={{ minHeight: 0, px: 2 }} />
          <Tab label="Berbintang" sx={{ minHeight: 0, px: 2 }} />
          <Tab label="Semua lokasi" sx={{ minHeight: 0, px: 2 }} />
        </Tabs>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>Memuat folder...</Box>
        ) : (
          <List sx={{ pt: 0 }}>
            {folders.map((folder) => (
              <ListItem
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)} // Ambil ID folder saat diklik
                sx={{
                  cursor: 'pointer',
                  bgcolor: selectedFolderId === folder.id ? 'primary.light' : 'transparent',
                  '&:hover': { bgcolor: 'grey.100' },
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                    <ChevronRightIcon fontSize="small" sx={{ color: 'grey.400' }} />
                  </Box>
                }
              >
                <FolderIcon sx={{ mr: 1, color: 'grey.600' }} />
                <ListItemText primary={folder.name} primaryTypographyProps={{ sx: { fontSize: 14 } }} />
              </ListItem>
            ))}
          </List>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={onClose} variant="text" sx={{ mr: 2 }}>
            Batal
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedFolderId || isMoving}
            onClick={handleMove}
          >
            {isMoving ? 'Memindahkan...' : 'Pindahkan'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FileManagerPathModal;
