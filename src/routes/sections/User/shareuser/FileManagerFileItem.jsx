// Atur FileManagerFileItem agar semua elemen dalam satu baris sejajar
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import {
  Box,
  Stack,
  Button,
  Avatar,
  Checkbox,
  Typography,
  AvatarGroup,
  TableRow,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
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
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { tableRowClasses } from '@mui/material/TableRow';
import FileManagerShareDialog from './FileManagerShareDialog';
import FileManagerFileDetails from './FileManagerFileDetails';
import { useAddFavoriteUser, useRemoveFavoriteUser } from './view/FetchFolderUser';

export default function FileManagerFileItem({ file, selected, onSelect, onDelete }) {
  const theme = useTheme();
  const { copy } = useCopyToClipboard();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: addFavorite } = useAddFavoriteUser();
  const { mutateAsync: removeFavorite } = useRemoveFavoriteUser();

  const [inviteEmail, setInviteEmail] = useState('');
  const checkbox = useBoolean();
  const share = useBoolean();
  const confirm = useBoolean();
  const details = useBoolean();
  const [issLoading, setIsLoading] = useState(false);

  const handleClick = useDoubleClick({
    click: details.onTrue,
    doubleClick: () => console.info('DOUBLE CLICK'),
  });
  const favorite = useBoolean(file.is_favorite);

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

  const handleCopy = useCallback(() => {
    if (file.url) {
      enqueueSnackbar('Berhasil di Copied!');
      copy(file.url);
    } else {
      enqueueSnackbar('Failed to copy: URL is undefined');
    }
  }, [copy, enqueueSnackbar, file.url]);

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
          {file.shared_with?.[0]?.created_at ? (
            <ListItemText
              primary={fDateTime(file.shared_with[0].created_at, 'dd MMM yyyy')}
              secondary={fDateTime(file.shared_with[0].created_at, 'p')}
              primaryTypographyProps={{ variant: 'body2' }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
              }}
            />
          ) : (
            'Tidak ada tanggal dibagikan'
          )}
        </TableCell>

        <TableCell onClick={handleClick} align="right">
          <Box sx={{ cursor: 'pointer', display: 'flex' }}>
            {file.user ? (
              <>
                <Avatar
                  alt={file.user.name}
                  src={file.user.avatarUrl}
                  sx={{ width: 24, height: 24, ml: 1 }} // Menambahkan margin right
                />
                <Tooltip title={file.user.email}>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 70, // Atur sesuai kebutuhan
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {file.user.email}
                  </Typography>
                </Tooltip>
              </>
            ) : (
              'Tidak ada pengguna'
            )}
          </Box>
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
            onChange={handleFavoriteToggle}
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
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />
    </>
  );
}

FileManagerFileItem.propTypes = {
  file: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
};
