import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useChangePermisionsFile, useRevokePermissionsFile } from './view/FetchDriveUser';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export default function FileManagerInvitedItem({ user, fileId, permissions, onClick }) {
  const [currentPermission, setPermission] = useState(permissions);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  useEffect(() => {
    setPermission(permissions);
  }, [permissions]);

  const popover = usePopover();

  const { mutate: changePermissionsFile } = useChangePermisionsFile({
    onSuccess: (_, { permissions: newPermission }) => {
      setPermission(newPermission);
      popover.onClose();
      enqueueSnackbar('Permission berhasil diperbarui!', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['folder.user'] });
    },
    onError: () => {
      enqueueSnackbar('Gagal memperbarui permission.', { variant: 'error' });
    },
  });

  const { mutate: revokePermissionsFile } = useRevokePermissionsFile({
    onSuccess: () => {
      enqueueSnackbar('Permission berhasil dihapus!', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['folder.user'] });
      popover.onClose();
    },
    onError: () => {
      enqueueSnackbar('Gagal menghapus permission', { variant: 'error' });
    },
  });

  const handleChangePermission = useCallback(
    (newPermission) => {
      changePermissionsFile({ file_id: fileId, user_id: user.id, permissions: newPermission });
    },
    [changePermissionsFile, fileId, user.id]
  );

  const handleRevokePermission = useCallback(() => {
    revokePermissionsFile({ file_id: fileId, user_id: user.id });
  }, [revokePermissionsFile, fileId, user.id]);

  return (
    <>
      <ListItem
        sx={{
          px: 0,
          py: 1,
          cursor: 'pointer',
        }}
        onClick={onClick}
      >
        <Avatar alt={user?.name || 'Unknown'} src={user?.photo_profile_url} sx={{ mr: 2 }} />

        <ListItemText
          primary={user?.name || 'Unknown'}
          secondary={
            <Tooltip title={user?.email || 'No email'}>
              <span>{user?.email || 'No email'}</span>
            </Tooltip>
          }
          primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
          secondaryTypographyProps={{ noWrap: true, component: 'span' }}
          sx={{ flexGrow: 1, pr: 1 }}
        />

        <Button
          size="small"
          color="inherit"
          endIcon={
            <Iconify
              width={20}
              icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
              sx={{ ml: -1 }}
            />
          }
          onClick={popover.onOpen}
          sx={{
            flexShrink: 0,
            ...(popover.open && {
              bgcolor: 'action.selected',
            }),
          }}
        >
          {currentPermission === 'read' ? 'Can view' : 'Can edit'}
        </Button>
      </ListItem>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        <>
          <MenuItem
            selected={currentPermission === 'read'}
            onClick={() => handleChangePermission('read')}
          >
            <Iconify icon="solar:eye-bold" />
            Can view
          </MenuItem>

          <MenuItem
            selected={currentPermission === 'write'}
            onClick={() => handleChangePermission('write')}
          >
            <Iconify icon="solar:pen-bold" />
            Can edit
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem onClick={handleRevokePermission} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Remove
          </MenuItem>
        </>
      </CustomPopover>
    </>
  );
}

FileManagerInvitedItem.propTypes = {
  fileId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    photo_profile_url: PropTypes.string,
  }).isRequired,
  permissions: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
