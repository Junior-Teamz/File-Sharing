import PropTypes from 'prop-types';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import FileManagerInvitedItem from './file-manager-invited-item';
import { usePermissionsFile, usePermissionsFolder } from './view/folderDetail';
import { useState } from 'react';
import { useIndexUser } from '../user/view/UserManagement';

export default function FileManagerShareDialog({
  shared,
  open,
  onClose,
  fileId,
  folderId,
  onCopyLink,
  ...other
}) {
  const hasShared = shared && shared.length > 0;
  const [selectedUserId, setSelectedUserId] = useState('');
  const [permission, setPermission] = useState();

  const { data: response = {}, loading, error } = useIndexUser();
  const users = response.data || [];

  const {mutateAsync: grantFilePermission } = usePermissionsFile();
  const {mutateAsyncL: grantFolderPermission } = usePermissionsFolder();

  const handleSendInvite = async () => {
    try {
      const shareLink = `${window.location.origin}/shared?fileId=${fileId || ''}&folderId=${folderId || ''}`;
      navigator.clipboard.writeText(shareLink);

      if (fileId) {
        await grantFilePermission({
          user_id: selectedUserId,
          file_id: fileId,
          permissions: permission,
        });
      } else if (folderId) {
        await grantFolderPermission({
          user_id: selectedUserId,
          folder_id: folderId,
          permissions: permission,
        });
      }

      console.log('Invite sent successfully');
    } catch (error) {
      console.error('Error sending invite:', error.response?.data.errors || error.message);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle>Invite</DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select User
            </MenuItem>
            {loading && <MenuItem disabled>Loading...</MenuItem>}
            {error && <MenuItem disabled>Error loading users</MenuItem>}
            {users.length === 0 && !loading && !error && (
              <MenuItem disabled>No users available</MenuItem>
            )}
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <Select value={permission} onChange={(e) => setPermission(e.target.value)} displayEmpty>
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
        <Button
          variant="contained"
          onClick={handleSendInvite}
          disabled={!selectedUserId || !permission} // Disable if user or permission is not selected
        >
          Invite
        </Button>

        {onCopyLink && (
          <Button startIcon={<Iconify icon="eva:link-2-fill" />} onClick={handleSendInvite}>
            Copy Link
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

FileManagerShareDialog.propTypes = {
  onClose: PropTypes.func,
  onCopyLink: PropTypes.func,
  open: PropTypes.bool.isRequired,
  shared: PropTypes.array,
  fileId: PropTypes.number,
  folderId: PropTypes.number,
};
