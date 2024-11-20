import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import {
  Box,
  Paper,
  Stack,
  Button,
  Avatar,
  Divider,
  MenuItem,
  Checkbox,
  IconButton,
  Typography,
  AvatarGroup,
  TableRow,
  ListItemText,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { avatarGroupClasses } from '@mui/material/AvatarGroup';
import { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
// utils
import { fDateTime } from 'src/utils/format-time';
import { fData } from 'src/utils/format-number';

// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useSnackbar } from 'src/components/snackbar';
import TextMaxLine from 'src/components/text-max-line';
import FileThumbnail from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FileManagerShareDialog from './FileManagerShareDialog';
import FileManagerFileDetails from './FileManagerFileDetails';
import { useAddFavoriteUser,useRemoveFavoriteUser } from './view/FetchFolderUser';

export default function FileManagerFileItem({ file,  selected, onSelect, onDelete, sx, ...other }) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { copy } = useCopyToClipboard();

  // Inside your FileRecentItem component
  const { mutateAsync: addFavorite } = useAddFavoriteUser();
  const { mutateAsync: removeFavorite } = useRemoveFavoriteUser();

  const [inviteEmail, setInviteEmail] = useState('');

  const checkbox = useBoolean();
  const share = useBoolean();
  const confirm = useBoolean();
  const details = useBoolean();
  const favorite = useBoolean(file.is_favorite);
  const [issLoading, setIsLoading] = useState(false);

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleCopy = useCallback(() => {
    if (file.url) {
      enqueueSnackbar('Berhasil di Copied!');
      copy(file.url);
    } else {
      enqueueSnackbar('Failed to copy: URL is undefined');
    }
  }, [copy, enqueueSnackbar, file.url]);

  const handleClick = useDoubleClick({
    click: details.onTrue,
    doubleClick: () => console.info('DOUBLE CLICK'),
  });

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

  const handleFavoriteToggle = useCallback(async () => {
    setIsLoading(true);

    try {
      if (favorite.value) {
        await removeFavorite({ file_id: file.id }); // Pastikan mengirim objek dengan file_id
        enqueueSnackbar('File berhasil dihapus dari favorite!', { variant: 'success' });
      } else {
        // Tambahkan ke favorit
        await addFavorite({ file_id: file.id }); // Pastikan mengirim objek dengan file_id
        enqueueSnackbar('File berhasil ditambahkan ke favorite', { variant: 'success' });
      }

      favorite.onToggle();
    } catch (error) {
      if (error.response && error.response.data.errors && error.response.data.errors.file_id) {
        enqueueSnackbar('file id harus di isi.', { variant: 'error' });
      } else {
        enqueueSnackbar('Error saat menambahkan favorite!', { variant: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [favorite.value, file.id, addFavorite, removeFavorite, enqueueSnackbar]);

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
        {/* <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onDoubleClick={() => console.info('ON DOUBLE CLICK')}
            onClick={onSelect}
          />
        </TableCell> */}

        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail file={file.type} sx={{ width: 36, height: 36 }} />
            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {file.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {fData(file.size)}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {file.type}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDateTime(file.favorited_at, 'dd MMM yyyy')}
            secondary={fDateTime(file.favorited_at, 'p')}
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
            {file.shared_with?.map((person) => (
              <Avatar key={person.id} alt={person.name} src={person.photo_profile_url} />
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
            onChange={handleFavoriteToggle} // Toggle favorite state
            sx={{ p: 0.75 }}
          />
        </TableCell>
      </TableRow>

      <FileManagerFileDetails
        item={file}
        favorited={favorite.value}
        onFavorite={favorite.onToggle}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={() => {
          details.onFalse();
          onDelete();
        }}
      />

      <FileManagerShareDialog
        open={share.value}
        shared={file.shared}
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
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}

FileManagerFileItem.propTypes = {
  file: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
  sx: PropTypes.object,
};
