import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'notistack'; 
import { useQueryClient } from '@tanstack/react-query';
import { useFetchUser } from './view/searchUserShare';
import FileManagerInvitedItem from './FileManagerInvitedItem';
import { usePermissionsFolder } from './view/FetchDriveUser';

export default function FileManagerShareDialogFolder({
  shared,
  inviteEmail,
  onCopyLink,
  onChangeInvite,
  folderId,
  open,
  onClose,
  ...other
}) {
  const hasShared = shared && !!shared.length;

  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermission] = useState('view');
  const [inputSearch, setInputSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]); 
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(inputSearch);
  const useClient = useQueryClient();

  const { refetch: searchUsers, isLoading } = useFetchUser({ email: debouncedSearchTerm });
  const { mutate: setPermissions } = usePermissionsFolder();

  const { enqueueSnackbar } = useSnackbar(); 

  const permissionsOptions = {
    view: 'read',
    edit: 'write',
  };

  // Effect to debounce input search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(inputSearch);
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [inputSearch]);


  useEffect(() => {
    if (debouncedSearchTerm) {
      searchUsers({ email: debouncedSearchTerm }).then((results) => {
        setSearchResults(results.data); 
      });
    } else {
      setSearchResults([]); 
    }
  }, [debouncedSearchTerm, searchUsers]); 

  const handleInviteChange = (e) => {
    setInputSearch(e.target.value);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setInputSearch(user.email); 
    setPermission('view'); 
  };

  const handlePermissionChange = (event) => {
    setPermission(event.target.value);
  };

  const handleSendInvite = () => {
    if (selectedUser && selectedUser.id && folderId) { 
      setPermissions(
        {
          user_id: selectedUser.id,
          permissions: permissionsOptions[permissions],
          folder_id: folderId, 
        },
        {
          onSuccess: () => {
            enqueueSnackbar('Invite sent successfully!', { variant: 'success' }); 
          },
          onError: (error) => {
            enqueueSnackbar(`Failed to send invite: ${error.message}`, { variant: 'error' }); 
          },
        }
      );
      setInputSearch(''); 
      setSearchResults([]); 
      setSelectedUser(null); 
      useClient.invalidateQueries({ queryKey: ['fetch.folder'] });
    } else {
      enqueueSnackbar('User ID or folder ID is missing.', { variant: 'warning' }); 
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle> Bagikan Folder </DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <TextField
          fullWidth
          value={inputSearch}
          placeholder="Search user by email"
          onChange={handleInviteChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  color="inherit"
                  variant="contained"
                  disabled={!selectedUser}
                  sx={{ mr: -0.75 }}
                  onClick={handleSendInvite}
                >
                  Kirim
                </Button>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {isLoading ? (
          <p>Loading...</p> 
        ) : (
          <Scrollbar sx={{ maxHeight: 60 * 6 }}>
            <List disablePadding>
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <FileManagerInvitedItem
                    key={user.id}
                    person={user}
                    onClick={() => handleUserSelect(user)} 
                  />
                ))
              ) : (
                <p>Tidak ada user</p> 
              )}
            </List>
          </Scrollbar>
        )}

        {selectedUser && (
          <div>
            <Select fullWidth value={permissions} onChange={handlePermissionChange} displayEmpty>
              <MenuItem value="view">View (Read)</MenuItem>
              <MenuItem value="edit">Edit (Write)</MenuItem>
            </Select>
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        {onCopyLink && (
          <Button startIcon={<Iconify icon="eva:link-2-fill" />} onClick={onCopyLink}>
            Copy link
          </Button>
        )}

        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Tutup
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

FileManagerShareDialogFolder.propTypes = {
  inviteEmail: PropTypes.string,
  onChangeInvite: PropTypes.func,
  onClose: PropTypes.func,
  onCopyLink: PropTypes.func,
  open: PropTypes.bool,
  shared: PropTypes.array,
  folderId: PropTypes.string.isRequired, // Mark as required
};
