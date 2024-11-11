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
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'notistack'; // Import useSnackbar
import { useQueryClient } from '@tanstack/react-query';
import { usePermissionsFolder } from './view/folderDetail';
import { useFetchUser } from './view/searchUserShare';
import FileManagerInvitedItem from './file-manager-invited-item';

export default function FileManagerShareDialogFolder({
  shared,
  inviteEmail,
  onCopyLink,
  onChangeInvite,
  folderId, // Changed from fileId to folderId
  open,
  onClose,
  ...other
}) {
  const hasShared = shared && !!shared.length;

  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermission] = useState('view');
  const [inputSearch, setInputSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Local state for search results
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(inputSearch);
  const useClient = useQueryClient();

  const { refetch: searchUsers, isLoading } = useFetchUser({ email: debouncedSearchTerm });
  const { mutate: setPermissions } = usePermissionsFolder();

  const { enqueueSnackbar } = useSnackbar(); // Initialize useSnackbar

  const permissionsOptions = {
    view: 'read',
    edit: 'write',
  };

  // Effect to debounce input search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(inputSearch);
    }, 300); // Delay of 300ms for the API call

    return () => {
      clearTimeout(handler);
    };
  }, [inputSearch]);

  // Effect to fetch search results when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchUsers({ email: debouncedSearchTerm }).then((results) => {
        setSearchResults(results.data); // Assuming your API returns the data directly
      });
    } else {
      setSearchResults([]); // Clear results if input is empty
    }
  }, [debouncedSearchTerm, searchUsers]); // Trigger search on debounced input change

  const handleInviteChange = (e) => {
    setInputSearch(e.target.value); // Update input search immediately
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setInputSearch(user.email); // Populate input with selected user's email
    setPermission('view'); // Reset permission to default
  };

  const handlePermissionChange = (event) => {
    setPermission(event.target.value);
  };

  const handleSendInvite = () => {
    if (selectedUser && selectedUser.id && folderId) {
      const existingPermission = shared.find(
        (share) => share.userId === selectedUser.id && share.permissions === permissionsOptions[permissions]
      );
  
      if (existingPermission) {
        enqueueSnackbar('User already has this permission on the folder.', { variant: 'info' });
        return;
      }
  
      setPermissions(
        {
          user_id: selectedUser.id,
          permissions: permissionsOptions[permissions],
          folder_id: folderId,
        },
        {
          onSuccess: () => {
            enqueueSnackbar('Invitation sent successfully!', { variant: 'success' });
            useClient.invalidateQueries({ queryKey: ['favorite.admin'] });
          },
          onError: (error) => {
            console.error('Error response:', error); // Log error to check structure
  
            if (error.response && error.response.status === 409) {
              enqueueSnackbar('User already has a permission on this folder. Please use the changePermission endpoint.', { variant: 'error' });
            } else {
              const errorMessage = error?.message || 'An unknown error occurred'; // Safely get message
              enqueueSnackbar(`Failed to send invite: ${errorMessage}`, { variant: 'error' });
            }
          },
        }
      );
      
      setInputSearch('');
      setSearchResults([]);
      setSelectedUser(null);
    } else {
      enqueueSnackbar('User ID or folder ID is missing.', { variant: 'warning' });
    }
  };
  
  
  

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle> Invite </DialogTitle>

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
                  Send Invite
                </Button>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Display search results dynamically */}
        {isLoading ? (
          <p>Loading...</p> // Show loading state
        ) : (
          <Scrollbar sx={{ maxHeight: 60 * 6 }}>
            <List disablePadding>
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <FileManagerInvitedItem
                    key={user.id}
                    person={user}
                    user={user}
                    onClick={() => handleUserSelect(user)} // Ensure onClick works
                  />
                ))
              ) : (
                <p>No users found</p> // Message when no users are found
              )}
            </List>
          </Scrollbar>
        )}

        {/* Permission Selection */}
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
            Close
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
