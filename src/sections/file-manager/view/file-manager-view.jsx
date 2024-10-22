import { useState, useCallback, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { _allFiles, FILE_TYPE_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { fileFormat } from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
//
import FileManagerTable from '../file-manager-table';
import FileManagerFilters from '../file-manager-filters';
import FileManagerGridView from '../file-manager-grid-view';
import FileManagerFiltersResult from '../file-manager-filters-result';
import FileManagerNewFolderDialog from '../file-manager-new-folder-dialog';
import { useFetchFolder } from 'src/sections/overview/app/view/folders';
import { handleFolderFiles } from 'src/_mock/map/filesFolderApi';
import Overlay from '../../../../public/assets/background/overlay_2.jpg';
// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  type: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function FileManagerView() {
  const table = useTable({ defaultRowsPerPage: 10 });

  const { data, isLoading } = useFetchFolder();


  const { FolderFiles } = handleFolderFiles();

  const settings = useSettingsContext();

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  const upload = useBoolean();

  const [view, setView] = useState('list');

  const [tableData, setTableData] = useState(FolderFiles);

  const [filters, setFilters] = useState(defaultFilters);

  const [selectedTags, setSelectedTags] = useState([]);

  // Refetch Folder Files only when FolderFiles has meaningful changes
  useEffect(() => {
    if (FolderFiles && FolderFiles !== tableData) {
      setTableData(FolderFiles);
    }
  }, [FolderFiles, tableData]);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset =
    !!filters.name || !!filters.type.length || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

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

  const handleTagChange = (tags) => {
    setSelectedTags(tags);
   
  };

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
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">File Manager</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={upload.onTrue}
          >
            Upload
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

      <FileManagerNewFolderDialog
        title="Buat Folder Baru "
        onTagChange={handleTagChange}
        open={upload.value}
        onClose={upload.onFalse}
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
