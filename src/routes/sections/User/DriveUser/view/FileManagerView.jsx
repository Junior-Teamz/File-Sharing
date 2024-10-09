import { useState, useCallback, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
// custom components
import FileManagerTable from '../FileManagerTable';
import FileManagerFilters from '../FileManagerFilters';
import FileManagerGridView from '../FileManagerGridView';
import FileManagerFiltersResult from '../FileManagerFiltersResult';
import FileManagerNewFolderDialog from '../FileManagerNewFolderDialog';
import FileManagerPanel from '../FileManagerPanel';
import { useDeleteFolder, useEditFolder, useMutationFolder } from './FetchFolderUser';
import FileManagerNewFileDialog from '../FileManagerNewFileDialog';
import { handleFolderFiles } from 'src/_mock/map/FilesFolderUser';
import { FILE_TYPE_OPTIONS } from 'src/_mock';

const defaultFilters = {
  name: '',
  type: [],
  startDate: null,
  endDate: null,
};

export default function FileManagerView() {
  const table = useTable({ defaultRowsPerPage: 10 });
  const { FolderFiles, refetch } = handleFolderFiles();
  const settings = useSettingsContext();

  const [view, setView] = useState('list');
  const [tableData, setTableData] = useState(FolderFiles);
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedTags, setSelectedTags] = useState([]);

  const openDateRange = useBoolean();
  const confirm = useBoolean();
  const upload = useBoolean();
  const folderDialog = useBoolean();
  const editDialog = useBoolean();

  const { mutate: createFolder } = useMutationFolder();
  const { mutate: editFolder } = useEditFolder();
  const { mutate: deleteFolder } = useDeleteFolder();

  // Refetch Folder Files only when FolderFiles has meaningful changes
  useEffect(() => {
    if (FolderFiles && FolderFiles !== tableData) {
      setTableData(FolderFiles);
    }
  }, [FolderFiles, tableData]);

  // Folder creation submission
  const handleCreateFolder = (folderData) => {
    createFolder(folderData, {
      onSuccess: () => {
        folderDialog.onFalse();
        refetch(); // Only refetch after closing the dialog to avoid loop
      },
    });
  };

  // Folder editing submission
  const handleEditFolder = (folderId, folderData) => {
    editFolder(
      { folderId, folderData },
      {
        onSuccess: () => {
          editDialog.onFalse();
          refetch(); // Only refetch after the dialog closes
        },
      }
    );
  };

  // Folder deletion handler
  const handleDeleteItems = useCallback(() => {
    deleteFolder(table.selected, {
      onSuccess: () => {
        confirm.onFalse();
        refetch(); // Only refetch after deletion is confirmed
      },
    });
  }, [table.selected, deleteFolder, refetch, confirm]);

  const canReset =
    !!filters.name || !!filters.type.length || (!!filters.startDate && !!filters.endDate);

  // Calculate the filtered data BEFORE rendering
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // View toggle handler (list/grid)
  const handleChangeView = useCallback((event, newView) => {
    if (newView !== null) setView(newView);
  }, []);

  // Filters handler
  const handleFilters = useCallback(
    (name, value) => {
      setFilters((prev) => ({ ...prev, [name]: value }));
      table.onResetPage();
    },
    [table]
  );

  // Reset filters handler
  const handleResetFilters = useCallback(() => setFilters(defaultFilters), []);

  // Render filters
  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <FileManagerFilters
        openDateRange={openDateRange.value}
        onOpenDateRange={openDateRange.onTrue}
        onCloseDateRange={openDateRange.onFalse}
        filters={filters}
        onFilters={handleFilters}
        typeOptions={FILE_TYPE_OPTIONS}
      />
      <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
        <ToggleButton value="list">
          <Iconify icon="solar:list-bold" />
        </ToggleButton>
        <ToggleButton value="grid">
          <Iconify icon="mingcute:dot-grid-fill" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );

  const renderResults = (
    <FileManagerFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      canReset={canReset}
      onFilters={handleFilters}
      results={dataFiltered.length}
    />
  );

  return (
    <>
      <Container sx={{ mt: 10 }} maxWidth={settings.themeStretch ? false : 'lg'}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={upload.onTrue}
        >
          Upload
        </Button>

        <FileManagerPanel title="Folder" onOpen={folderDialog.onTrue} sx={{ mt: 5 }} />

        {/* Folder Creation Dialog */}
        <FileManagerNewFolderDialog
          open={folderDialog.value}
          onClose={folderDialog.onFalse}
          onSubmit={handleCreateFolder}
        />

        {/* Folder Editing Dialog */}
        <FileManagerNewFolderDialog
          open={editDialog.value}
          onClose={editDialog.onFalse}
          onSubmit={handleEditFolder}
          isEditMode
        />

        <Stack spacing={2.5} sx={{ my: { xs: 3, md: 5 } }}>
          {renderFilters}
          {renderResults}
        </Stack>

        {/* Conditional rendering for table or grid view */}
        {notFound ? (
          <EmptyContent filled title="No Data" sx={{ py: 10 }} />
        ) : view === 'list' ? (
          <FileManagerTable
            table={table}
            tableData={dataFiltered}
            onDeleteRow={handleDeleteItems}
            onRefetch={refetch}
          />
        ) : (
          <FileManagerGridView
            table={table}
            data={dataFiltered}
            onDeleteItem={handleDeleteItems}
            onRefetch={refetch}
          />
        )}
      </Container>

      {/* Upload File Dialog */}
      <FileManagerNewFileDialog open={upload.value} onClose={upload.onFalse} onRefetch={refetch} />

      {/* Confirm Dialog for Deletion */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure you want to delete ${table.selected.length} items?`}
        action={
          <Button variant="contained" color="error" onClick={handleDeleteItems}>
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, type, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (type.length) {
    inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
  }

  if (startDate && endDate) {
    inputData = inputData.filter(
      (file) =>
        fTimestamp(file.createdAt) >= fTimestamp(startDate) &&
        fTimestamp(file.createdAt) <= fTimestamp(endDate)
    );
  }

  return inputData;
}
