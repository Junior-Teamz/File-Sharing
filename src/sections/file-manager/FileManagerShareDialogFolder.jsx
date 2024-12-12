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
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { usePermissionsFolder } from './view/folderDetail';
import { useFetchUser } from './view/searchUserShare';
import FileManagerInvitedItem from './file-manager-invited-item';
import { useGenerateLinkFolder } from './view/ShareLink';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

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
  const { copy } = useCopyToClipboard();

  const { data: shareableLink, isLoading: isLinkLoading } = useGenerateLinkFolder(folderId);

  const permissionsOptions = {
    view: 'read',
    edit: 'write',
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(inputSearch);
    }, 1000);

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
            useClient.invalidateQueries({ queryKey: ['folder.admin'] });
            enqueueSnackbar('Folder Berhasil dikirim!', { variant: 'success' });
          },
          onError: (error) => {
            enqueueSnackbar(`Gagal mengirim folder: ${error.message}`, { variant: 'error' });
          },
        }
      );
      setInputSearch('');
      setSearchResults([]);
      setSelectedUser(null);
    } else {
      enqueueSnackbar('User id atau folder id menghilang', { variant: 'warning' });
    }
  };

  const handleCopyLink = () => {
    if (!isLinkLoading && shareableLink) {
      copy(shareableLink);
      enqueueSnackbar('Tautan disalin ke papan klip!', { variant: 'success' });
    } else {
      enqueueSnackbar('Gagal salin link.', { variant: 'error' });
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle> Undang </DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <TextField
          fullWidth
          value={inputSearch}
          placeholder="Cari berdasarkan email"
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
                  Kirim Undangan
                </Button>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {isLoading ? (
          <p>Memuat...</p>
        ) : (
          <Scrollbar sx={{ maxHeight: 60 * 6 }}>
            <List disablePadding>
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <FileManagerInvitedItem
                    key={user.id}
                    permissions={permissions}
                    person={user}
                    user={user}
                    onClick={() => handleUserSelect(user)}
                  />
                ))
              ) : (
                <p>Pengguna tidak ditemukan</p>
              )}
            </List>
          </Scrollbar>
        )}

        {selectedUser && (
          <div>
            <Select fullWidth value={permissions} onChange={handlePermissionChange} displayEmpty>
              <MenuItem value="view">View (View)</MenuItem>
              <MenuItem value="edit">Edit (Edit)</MenuItem>
            </Select>
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        {onCopyLink && (
          <Button startIcon={<Iconify icon="eva:link-2-fill" />} onClick={handleCopyLink}>
            Salin tautan
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
  folderId: PropTypes.string.isRequired,
};
