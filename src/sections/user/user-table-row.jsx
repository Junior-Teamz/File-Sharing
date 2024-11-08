import PropTypes from 'prop-types';
import { useBoolean } from 'src/hooks/use-boolean';
import {
  Button,
  Avatar,
  Tooltip,
  MenuItem,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import UserQuickEditForm from './user-quick-edit-form';

// ----------------------------------------------------------------------

function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, refetch }) {
  const { name, avatarUrl, instances = [], role, email } = row;

  const confirm = useBoolean();
  const quickEdit = useBoolean();
  const popover = usePopover();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <TableRow hover selected={selected} sx={{ '&:not(:last-child)': { mb: 1 } }}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} />
          <ListItemText
            primary={name}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {instances.length > 0
            ? instances.map((instance) => (
                <div key={instance.id} value={instance.id}>
                  {instance.name}
                </div>
              ))
            : 'No Instance'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {Array.isArray(role) ? role.join(', ') : role}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Tooltip title="More Actions" placement="top">
            <IconButton onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <UserQuickEditForm
        currentUser={row}
        instances={instances}
        open={quickEdit.value}
        onRefetch={refetch}
        onClose={quickEdit.onFalse}
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: isSmallScreen ? '100%' : 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            quickEdit.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete this item?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Hapus
          </Button>
        }
      />
    </>
  );
}

UserTableRow.propTypes = {
  onDeleteRow: PropTypes.func.isRequired,
  onEditRow: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    instance_data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        address: PropTypes.string,
      })
    ),
    role: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default UserTableRow;
