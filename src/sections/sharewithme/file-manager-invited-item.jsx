import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
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

// ----------------------------------------------------------------------

export default function FileManagerInvitedItem({ user, onClick, permissions }) {
  const [currentPermission, setPermission] = useState(permissions || 'view');
  console.log(permissions);
  const PermissionRead = permissions === 'read';
  const PermissionEdit = permissions === 'write';
  // const permission = permissions.find((item) => item.permissions === 'read');
  // const PermissionRead = permission !== undefined;
  // const PermissionEdit = permissions.some((item) => item.permissions === 'write');

  const popover = usePopover();

  const handleChangePermission = useCallback((newPermission) => {
    if (PermissionRead || PermissionEdit) {
      return;
    }
    setPermission(newPermission);
  }, []);

  return (
    <>
      <ListItem
        sx={{
          px: 0,
          py: 1,
          cursor: 'pointer', // Change cursor to pointer for better UX
        }}
        onClick={onClick} // Handle click event
      >
        <Avatar alt={user?.name || 'Unknown'} src={user?.avatarUrl} sx={{ mr: 2 }} />

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

        {!PermissionRead && !PermissionEdit && (
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
            Can {currentPermission}
          </Button>
        )}
      </ListItem>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        <>
          <MenuItem
            selected={currentPermission === 'view'}
            onClick={() => {
              popover.onClose();
              handleChangePermission('view');
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Can view
          </MenuItem>

          <MenuItem
            selected={currentPermission === 'edit'}
            onClick={() => {
              popover.onClose();
              handleChangePermission('edit');
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Can edit
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Remove
          </MenuItem>
        </>
      </CustomPopover>
    </>
  );
}

FileManagerInvitedItem.propTypes = {
  user: PropTypes.object.isRequired,
  permissions: PropTypes.string.isRequired,
  onClick: PropTypes.func, // Add onClick prop type
};
