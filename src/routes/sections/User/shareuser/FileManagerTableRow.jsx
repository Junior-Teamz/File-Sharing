import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { useRemoveFavoriteUser, useAddFavoriteUser } from './view/FetchFolderUser';
// utils
import { fData } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FileThumbnail from 'src/components/file-thumbnail';
//
import FileManagerShareDialog from './FileManagerShareDialog';
import FileManagerFileDetails from './FileManagerFileDetails';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export default function FileManagerTableRow({
  file = {},
  row,
  selected,
  fileId,
  onSelectRow,
  onDeleteRow,
}) {
  const theme = useTheme();

  const useClient = useQueryClient();

  const { name, size, type, updated_at, shared_with, isFavorited } = row;

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  const favorite = useBoolean(isFavorited);

  const details = useBoolean();

  const share = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });

  const handleCopy = useCallback(() => {
    enqueueSnackbar('berhasil di Copied!');
    copy(row.url);
  }, [copy, enqueueSnackbar, row.url]);

  const defaultStyles = {
    borderTop: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
  };

  const { mutateAsync: addFavorite } = useAddFavoriteUser();
  const { mutateAsync: removeFavorite } = useRemoveFavoriteUser();

  // Function to handle the favorite toggle
  const handleFavoriteToggle = useCallback(async () => {
    if (!file.id) {
      enqueueSnackbar('File ID is required to toggle favorite status!', { variant: 'error' });
      return; // Early return if file.id is not valid
    }

    const payload = { file_id: file.id }; // Create a payload with the required structure
   
    try {
      if (favorite.value) {
        // If currently favorited, call removeFavorite
      
        await removeFavorite(payload, {
          // Pass the entire payload object
          onSuccess: () => {
            enqueueSnackbar('File dihapus dari favorit!', { variant: 'success' });
          },
          onError: () => {
            enqueueSnackbar('Failed to remove from favorites!', { variant: 'error' });
          },
        });
      } else {
        // If not favorited, call addFavorite
      
        await addFavorite(payload, {
          // Pass the entire payload object
          onSuccess: () => {
            enqueueSnackbar('File telah ditambahkan ke favorit!', { variant: 'success' });
          },
          onError: () => {
            enqueueSnackbar('Failed to add to favorites!', { variant: 'error' });
          },
        });
      }

      // Toggle the favorite state
      favorite.onToggle();

      // Optionally refetch any relevant queries
      useClient.invalidateQueries({ queryKey: ['fetch.folder'] });
      useClient.invalidateQueries({ queryKey: ['detail-folder'] });
    } catch (error) {
      console.error('Error updating favorite status:', error); // Log the error
      enqueueSnackbar('Failed to update favorite status!', { variant: 'error' });
    }
  }, [favorite.value, file.id, removeFavorite, addFavorite, enqueueSnackbar, useClient]);

  return (
    <>
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: theme.customShadows.z20,
            },
          },
          [`& .${tableCellClasses.root}`]: {
            ...defaultStyles,
          },
          ...(details.value && {
            [`& .${tableCellClasses.root}`]: {
              ...defaultStyles,
            },
          }),
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onDoubleClick={() => console.info('ON DOUBLE CLICK')}
            onClick={onSelectRow}
          />
        </TableCell>

        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail file={type} sx={{ width: 36, height: 36 }} />

            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {fData(size)}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {type}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={format(new Date(updated_at), 'dd MMM yyyy')}
            secondary={format(new Date(updated_at), 'p')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell align="right" onClick={handleClick}>
          <AvatarGroup
            max={4}
            sx={{
              display: 'inline-flex',
              [`& .${avatarGroupClasses.avatar}`]: {
                width: 24,
                height: 24,
                '&:first-of-type': {
                  fontSize: 12,
                },
              },
            }}
          >
            {shared_with &&
              shared_with.map((person) => (
                <Avatar key={person.id} alt={person.name} src={person.avatarUrl} />
              ))}
          </AvatarGroup>
        </TableCell>

        <TableCell
          align="right"
          sx={{
            px: 1,
            whiteSpace: 'nowrap',
          }}
        >
          <Checkbox
            color="warning"
            icon={<Iconify icon="eva:star-outline" />}
            checkedIcon={<Iconify icon="eva:star-fill" />}
            checked={favorite.value}
            onChange={handleFavoriteToggle} // Update here to call handleFavoriteToggle
          />
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            handleCopy();
          }}
        >
          <Iconify icon="eva:link-2-fill" />
          Copy Link
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            share.onTrue();
          }}
        >
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

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
      </CustomPopover>

      <FileManagerFileDetails
        item={row}
        favorited={favorite.value}
        onFavorite={favorite.onToggle}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
      />

      <FileManagerShareDialog
        open={share.value}
        fileId={row.id} // Ensure this ID exists in the row object
        shared={shared_with}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

FileManagerTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  fileId: PropTypes.string, // fileId is now optional
  row: PropTypes.object,
  selected: PropTypes.bool,
};
