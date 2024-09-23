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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import FileManagerInvitedItem from './file-manager-invited-item';
import { usePermissionsFile, usePermissionsFolder } from './view/folderDetail';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export default function FileManagerShareDialog({
  shared,
  inviteEmail,
  onChangeInvite,
  folderId,
  fileId,
  open,
  onClose,
  onCopyLink, // Tambahkan props untuk handle copy link
  ...other
}) {
  const hasShared = shared && shared.length > 0;

  // Menggunakan usePermissionsFile atau usePermissionsFolder
  const { permissions: filePermissions } = usePermissionsFile(fileId);
  const { permissions: folderPermissions } = usePermissionsFolder(folderId);

  const [currentPermissions, setCurrentPermissions] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    console.log('folderId:', folderId);
    console.log('fileId:', fileId);
    if (folderId) {
      setCurrentPermissions(folderPermissions);
    } else if (fileId) {
      setCurrentPermissions(filePermissions);
    }
  }, [folderId, fileId, folderPermissions, filePermissions]);

  useEffect(() => {
    const id = folderId || fileId;
    if (id) {
      const newLink = `${window.location.origin}/shared/${id}?permission=${currentPermissions}`;
      setLink(newLink);
    }
  }, [folderId, fileId, currentPermissions]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    alert('Link copied: ' + link);
    if (onCopyLink) onCopyLink(link); // Panggil props onCopyLink
  };

  const handlePermissionChange = (event) => {
    setCurrentPermissions(event.target.value);
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle>Invite</DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        {onChangeInvite && (
          <TextField
            fullWidth
            value={inviteEmail}
            placeholder="Email"
            onChange={onChangeInvite}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    color="inherit"
                    variant="contained"
                    disabled={!inviteEmail}
                    sx={{ mr: -0.75 }}
                  >
                    Send Invite
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <Select
            value={currentPermissions}
            onChange={handlePermissionChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Permission
            </MenuItem>
            <MenuItem value="read">Read</MenuItem>
            <MenuItem value="write">Write</MenuItem>
          </Select>
        </FormControl>

        {hasShared && (
          <Scrollbar sx={{ maxHeight: 60 * 6 }}>
            <List disablePadding>
              {shared.map((person) => (
                <FileManagerInvitedItem key={person.id} person={person} />
              ))}
            </List>
          </Scrollbar>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button startIcon={<Iconify icon="eva:link-2-fill" />} onClick={handleCopyLink}>
          Copy link
        </Button>

        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

FileManagerShareDialog.propTypes = {
  inviteEmail: PropTypes.string,
  onChangeInvite: PropTypes.func,
  onClose: PropTypes.func,
  onCopyLink: PropTypes.func, // Definisikan prop untuk onCopyLink
  folderId: PropTypes.string,
  fileId: PropTypes.string,
  open: PropTypes.bool.isRequired,
  shared: PropTypes.array,
};
