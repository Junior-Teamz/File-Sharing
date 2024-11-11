import PropTypes from 'prop-types';
import { useState, useRef, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import TableContainer from '@mui/material/TableContainer';
import { tableCellClasses } from '@mui/material/TableCell';
import { tablePaginationClasses } from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { Link } from 'react-router-dom';
import FileManagerPanel from './file-manager-panel';
import FileManagerFileItem from './file-manager-file-item';
import FileManagerFolderItem from './file-manager-folder-item';
import FileManagerActionSelected from './file-manager-action-selected';
import FileManagerShareDialog from './file-manager-share-dialog';
import FileManagerNewFolderDialog from './file-manager-new-folder-dialog';
import {
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  emptyRows,
} from 'src/components/table';
import FileManagerFileDialog from './FileManagerFileDialog';
import Folderpanel from './Folderpanel';
import EmptyContent from 'src/components/empty-content';
import TableShare from 'src/components/table/tableshare';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nama' },
  { id: 'size', label: 'Ukuran', width: 120 },
  { id: 'type', label: 'Tipe', width: 120 },
  { id: 'created_at', label: 'tanggal dibagikan', width: 200 },
  { id: 'shared', label: 'Dibagikan Oleh', align: 'right', width: 140 },
  { id: '', label: '', align: 'right', width: 140 },
];

export default function FileManagerGridView({
  table,
  data,
  dataFiltered,
  notFound,
  onDeleteItem,
  onOpenConfirm,
}) {
  const {
    page,
    rowsPerPage,
    dense,
    selected,
    onSelectRow: onSelectItem,
    onSelectAllRows: onSelectAllItems,
  } = table;
  const theme = useTheme();

  const containerRef = useRef(null);
  const [folderName, setFolderName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const share = useBoolean();
  const newFolder = useBoolean();
  const upload = useBoolean();
  const files = useBoolean();
  const folders = useBoolean();

  // Handlers
  const handleChangeInvite = useCallback((event) => setInviteEmail(event.target.value), []);
  const handleChangeFolderName = useCallback((event) => setFolderName(event.target.value), []);
  const handleTagChange = (tags) => setSelectedTags(tags);

  const denseHeight = dense ? 58 : 78;

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = dataFiltered
    .filter((i) => i.type !== 'folder')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by modifiedAt in descending order
    .slice(startIndex, endIndex);

  // Render
  return (
    <>
      <Box ref={containerRef}>
        {/* Folders Panel */}
        <Folderpanel
          title="Folder yang dibagikan"
          showMore={folders.value}
          onOpen={folders.onToggle}
        />

        <Collapse in={!folders.value} unmountOnExit>
          <Box
            display="grid"
            gap={3}
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
          >
            {dataFiltered.filter((i) => i.type === 'folder').length > 0 ? (
              dataFiltered
                .filter((i) => i.type === 'folder')
                .map((folder, idx) => (
                  <FileManagerFolderItem
                    key={folder.id}
                    folder={folder}
                    selected={selected.includes(folder.id)}
                    onSelect={() => onSelectItem(folder.id)}
                    onDelete={() => onDeleteItem(folder.id)}
                    sx={{ maxWidth: 'auto' }}
                  />
                ))
            ) : (
              <EmptyContent
                filled
                title="Tidak ada folder yang dibagikan"
                sx={{
                  py: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%', // Menyesuaikan tinggi dengan kontainer
                  gridColumn: 'span 4', // Membuatnya memenuhi semua kolom (4 kolom di layout grid)
                }}
              />
            )}
          </Box>
        </Collapse>

        <Divider sx={{ my: 5, borderStyle: 'dashed' }} />

        {/* Files Panel */}
        {/* <FileManagerPanel title="Files" onOpen={upload.onTrue} /> */}
        <Box
          sx={{
            position: 'relative',
            m: theme.spacing(-2, -3, -3, -3),
          }}
        >
        
          {/* <TableSelectedAction
            dense={dense}
            numSelected={selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              onSelectAllItems(
                checked,
                dataFiltered.map((row) => row.id)
              )
            }
            action={
              <>
                <Tooltip title="Share">
                  <IconButton color="primary">
                    <Iconify icon="solar:share-bold" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={onOpenConfirm}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              </>
            }
            sx={{
              pl: 1,
              pr: 2,
              top: 16,
              left: 24,
              right: 24,
              width: 'auto',
              borderRadius: 1.5,
            }}
          /> */}

          {/* Files Table */}
          <TableContainer
            sx={{
              p: theme.spacing(0, 3, 3, 3),
            }}
          >
            <Folderpanel title="File yang dibagikan" />
            <Table
              size={dense ? 'small' : 'medium'}
              sx={{
                minWidth: 960,
                borderCollapse: 'separate',
                borderSpacing: '0 16px',
              }}
            >
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                // onSelectAllRows={(checked) =>
                //   onSelectAllItems(
                //     checked,
                //     dataFiltered.map((row) => row.id)
                //   )
                // }
                sx={{
                  [`& .${tableCellClasses.head}`]: {
                    '&:first-of-type': {
                      borderTopLeftRadius: 12,
                      borderBottomLeftRadius: 12,
                    },
                    '&:last-of-type': {
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                    },
                  },
                }}
              />

              <TableBody>
                {currentData.map((file) => (
                  <FileManagerFileItem
                    key={file.id}
                    file={file}
                    selected={selected.includes(file.id)}
                    onSelect={() => onSelectRow(file.id)}
                    onDelete={() => onDeleteItem(file.id)}
                  />
                ))}
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                />
                <TableNoData
                  notFound={notFound}
                  sx={{
                    m: -2,
                    borderRadius: 1.5,
                    border: `dashed 1px ${theme.palette.divider}`,
                  }}
                />
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Pagination */}
        <TablePaginationCustom
          count={dataFiltered.length}
          page={0}
          rowsPerPage={10}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          sx={{ [`& .${tablePaginationClasses.toolbar}`]: { borderTopColor: 'transparent' } }}
        />
      </Box>

      {/* Dialogs */}
      <FileManagerShareDialog
        open={share.value}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      <FileManagerFileDialog
        onTagChange={handleTagChange}
        open={upload.value}
        onClose={upload.onFalse}
      />

      <FileManagerNewFolderDialog
        open={newFolder.value}
        onClose={newFolder.onFalse}
        title="Buat Folder Baru"
        onCreate={() => {
          console.info('CREATE NEW FOLDER', folderName);
          newFolder.onFalse();
          setFolderName('');
        }}
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
      />
    </>
  );
}

FileManagerGridView.propTypes = {
  table: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  dataFiltered: PropTypes.array.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onOpenConfirm: PropTypes.func.isRequired,
};
