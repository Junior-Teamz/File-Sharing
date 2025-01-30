import React, { useState, useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const FileManagerPathModal = ({ open, onClose, folderName }) => {
  const [tabValue, setTabValue] = useState(0);
  const [currentLocation] = useState('Drive Saya');

  const folders = [
    { id: 1, name: 'Kas Kelas' },
    { id: 2, name: 'Logo Smkn 1 Ciomas' },
    { id: 3, name: 'Drive Pengumpulan Cerpen Bahasa indonesia' },
    { id: 4, name: 'Foto' },
    { id: 5, name: 'Video' },
    { id: 6, name: 'Curug Putri Pelangi' },
    { id: 7, name: 'Classroom' },
    { id: 8, name: 'Teks Transisi' }
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="border-b">
        <div className="mb-4">Pindahkan "{folderName}"</div>
        <div className="text-sm mb-4">
          Lokasi saat ini: <span className="bg-gray-100 px-2 py-1 rounded">{currentLocation}</span>
        </div>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} className="min-h-0">
          <Tab label="Disarankan" className="min-h-0 px-4" />
          <Tab label="Berbintang" className="min-h-0 px-4" />
          <Tab label="Semua lokasi" className="min-h-0 px-4" />
        </Tabs>
      </DialogTitle>
      <DialogContent className="p-0">
        <List className="pt-0">
          {folders.map((folder) => (
            <ListItem
              key={folder.id}
              className="hover:bg-gray-50 group"
              secondaryAction={
                <div className="invisible group-hover:visible flex items-center">
                  <IconButton size="small" className="mr-1">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <ChevronRightIcon fontSize="small" className="text-gray-400" />
                </div>
              }
            >
              <FolderIcon className="mr-2 text-gray-600" />
              <ListItemText 
                primary={folder.name}
                primaryTypographyProps={{
                  className: "text-sm"
                }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <Box className="flex justify-end p-4 border-t">
        <Button onClick={onClose} variant="text" className="mr-2">
          Batal
        </Button>
        <Button variant="contained" color="primary" disabled>
          Pindahkan
        </Button>
      </Box>
    </Dialog>
  );
};

export default FileManagerPathModal;