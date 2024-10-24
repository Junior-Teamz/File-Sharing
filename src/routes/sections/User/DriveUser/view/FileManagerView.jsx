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
import { fileFormat } from 'src/components/file-thumbnail';
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
import { Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

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
  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const openDateRange = useBoolean();
  const confirm = useBoolean();
  const upload = useBoolean();
  const create = useBoolean();
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

  const canReset =
    !!filters.name || !!filters.type.length || (!!filters.startDate && !!filters.endDate);

  // Calculate the filtered data BEFORE rendering
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

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

  const handleTagChange = (tags) => {
    setSelectedTags(tags); // Update the selected tags state
  
  };

  const handleDeleteItem = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <FileManagerFilters
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        dateError={dateError}
        typeOptions={FILE_TYPE_OPTIONS}
      />
    </Stack>
  );

  const renderResults = (
    <FileManagerFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mt: '20px' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">Drive Saya</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={upload.onTrue}
          >
            Upload File
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={create.onTrue}
          >
            Create Folder
          </Button>
        </Stack>

        <Stack
          spacing={2.5}
          sx={{
            my: { xs: 3, md: 5 },
          }}
        >
          {renderFilters}

          {canReset && renderResults}
        </Stack>

        {notFound ? (
          <EmptyContent filled title="Tidak ada data" sx={{ py: 10 }} />
        ) : (
          <FileManagerGridView
            table={table}
            data={tableData}
            dataFiltered={dataFiltered}
            onDeleteItem={handleDeleteItem}
            onOpenConfirm={confirm.onTrue}
          />
        )}
      </Container>

      <FileManagerNewFileDialog
        onTagChange={handleTagChange}
        open={upload.value}
        onClose={upload.onFalse}
      />

      <FileManagerNewFolderDialog
        title="Buat Folder Baru "
        onTagChange={handleTagChange}
        open={create.value}
        onClose={create.onFalse}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Apakah Anda yakin ingin menghapus? <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
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

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (file) =>
          fTimestamp(file.created_at) >= fTimestamp(startDate) &&
          fTimestamp(file.created_at) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
