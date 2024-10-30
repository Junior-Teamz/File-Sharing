import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
// utils
import { fData } from 'src/utils/format-number';

// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
//
import FileManagerShareDialog from './FileManagerShareDialog';
import FileManagerFileDetails from './FileManagerFileDetails';
import FileManagerNewFolderDialog from './FileManagerNewFolderDialog';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom';
import FolderDetail from './FolderDetail';
import FileManagerShareDialogFolder from './FileManagerShareDialogFolder';
import { useAddFavoriteFolder, useRemoveFavoriteFolder } from '../favoriteuser/view/Folder';

// ----------------------------------------------------------------------

export default function FileManagerFolderItem({
  folder,
  selected,
  onSelect,
  onDelete,
  sx,
  ...other
}) {
  const { mutateAsync: addFavorite } = useAddFavoriteFolder();
  const { mutateAsync: removeFavorite } = useRemoveFavoriteFolder();

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  const [folderName, setFolderName] = useState(folder.name);

  const editFolder = useBoolean();

  const checkbox = useBoolean();

  const share = useBoolean();

  const confirm = useBoolean();

  const details = useBoolean();

  const favorite = useBoolean(folder.is_favorite);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    favorite.setValue(folder.is_favorite); // Set the state from props or backend response
  }, [folder.is_favorite]);

  const handleFavoriteToggle = useCallback(async () => {
    const folder_id = folder.folder_id; // Ensure folder_id comes from folder object

    if (!folder_id) {
      enqueueSnackbar('ID Folder diperlukan untuk mengubah status favorit!', { variant: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      if (favorite.value) {
        await removeFavorite({ folder_id });
        enqueueSnackbar('Folder dihapus dari favorit!', { variant: 'success' });
      } else {
        await addFavorite({ folder_id });
        enqueueSnackbar('Folder ditambahkan ke favorit!', { variant: 'success' });
      }
      favorite.onToggle();
    } catch (error) {
      enqueueSnackbar('Gagal memperbarui status favorit!', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [favorite.value, folder.folder_id, addFavorite, removeFavorite, enqueueSnackbar]);

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleChangeFolderName = useCallback((event) => {
    setFolderName(event.target.value);
  }, []);

  const handleCopy = useCallback(() => {
    enqueueSnackbar('Copied!');
    copy(folder.url);
  }, [copy, enqueueSnackbar, folder.url]);

  const renderAction = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        right: 8,
        position: 'absolute',
      }}
    >
      <IconButton onClick={details.onTrue}>
        <InfoIcon />
      </IconButton>

      <Checkbox
        color="warning"
        icon={<Iconify icon="eva:star-outline" />}
        checkedIcon={<Iconify icon="eva:star-fill" />}
        checked={favorite.value}
        onChange={handleFavoriteToggle}
      />
    </Stack>
  );

  const renderIcon = (
    <Box component="img" src="/assets/icons/files/ic_folder.svg" sx={{ width: 36, height: 36 }} />
  );

  const renderText = (
    <ListItemText
      onClick={details.onTrue}
      primary={folder.name}
      secondary={
        <>
          {fData(folder.total_size)}
          <Box
            component="span"
            sx={{
              mx: 0.75,
              width: 2,
              height: 2,
              borderRadius: '50%',
              bgcolor: 'currentColor',
            }}
          />
          {folder.total_file} files
        </>
      }
      primaryTypographyProps={{
        noWrap: true,
        typography: 'subtitle1',
      }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        alignItems: 'center',
        typography: 'caption',
        color: 'text.disabled',
        display: 'inline-flex',
      }}
    />
  );

  const renderAvatar = (
    <AvatarGroup
      max={3}
      sx={{
        [`& .${avatarGroupClasses.avatar}`]: {
          width: 24,
          height: 24,
          '&:first-of-type': {
            fontSize: 12,
          },
        },
      }}
    >
      {folder.shared_with?.map((person) => (
        <Avatar key={person.id} alt={person.name} src={person.avatarUrl} />
      ))}
    </AvatarGroup>
  );

  return (
    <>
      <Stack
        component={Paper}
        variant="outlined"
        spacing={1}
        alignItems="flex-start"
        sx={{
          p: 2.5,
          maxWidth: 222,
          borderRadius: 2,
          bgcolor: 'unset',
          cursor: 'pointer',
          position: 'relative',
          ...((checkbox.value || selected) && {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        <Link key={folder.id} to={`folder/${folder.folder_id}`}>
          <Box onMouseEnter={checkbox.onTrue} onMouseLeave={checkbox.onFalse}>
            {renderIcon}
          </Box>
          {renderText}
        </Link>

        {renderAction}

        {!!folder?.shared_with?.length && renderAvatar}
      </Stack>

      <FileManagerShareDialogFolder
        open={share.value}
        folderId={folder.id}
        shared={folder.shared_with}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      <FileManagerNewFolderDialog
        open={editFolder.value}
        onClose={editFolder.onFalse}
        title="Edit Folder"
        onUpdate={() => {
          editFolder.onFalse();
          setFolderName(folderName);
          console.info('UPDATE FOLDER', folderName);
        }}
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
      />

      <FolderDetail
        item={folder}
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

FileManagerFolderItem.propTypes = {
  folder: PropTypes.object,
  onDelete: PropTypes.func,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  sx: PropTypes.object,
};
