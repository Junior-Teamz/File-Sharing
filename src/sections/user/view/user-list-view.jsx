import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Tooltip,
  Container,
  TableBody,
  IconButton,
  TableContainer,
  CircularProgress,
} from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { useIndexUser, useDeleteUser } from './UserManagement';
import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import debounce from 'lodash/debounce';
import { useIndexInstance } from 'src/sections/instancepages/view/Instance';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 180 },
  { id: 'email', label: 'Email', width: 240 },
  { id: 'instance', label: 'Instansi', width: 180 },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'action', label: 'Action', width: 120 },
];

const DEBOUNCE_DELAY = 1500;

const defaultFilters = {
  name: '',
  role: [],
  instances: [],
};

// Define allowed roles explicitly
const allowedRoles = ['user', 'admin'];

export default function UserListView() {
  const table = useTable();
  const settings = useSettingsContext();
  const confirm = useBoolean();
  const [filters, setFilters] = useState(defaultFilters);
  const [searchTerm, setSearchTerm] = useState(filters.name);

  const { data: Instansi } = useIndexInstance();
  const { data, isLoading, refetch, isFetching } = useIndexUser(filters);
  const roleOptions = allowedRoles;
  const instanceOptions = Instansi?.data || [];

  const debouncedSearch = useCallback(
    debounce((query) => {
      setFilters((prev) => ({
        ...prev,
        name: query,
      }));
    }, DEBOUNCE_DELAY),
    []
  );

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const tableData = data?.data || [];

  const handleFilters = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Apply filters to the user data
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;
  const notFound = !dataFiltered.length;

  const { mutate: deleteUser } = useDeleteUser({
    onSuccess: () => {
      refetch();
      confirm.onFalse();
    },
    onError: (error) => console.error(`Failed to delete user: ${error.message}`),
  });

  const handleDeleteRow = useCallback((ids) => deleteUser(ids), [deleteUser]);

  useEffect(() => {
    refetch();
  }, [filters]);

  const handleFilterRole = (selectedRoles) => {
    setFilters((prev) => ({
      ...prev,
      role: selectedRoles,
    }));
  };

  const handleFilterInstances = (selectedInstances) => {
    setFilters((prev) => ({
      ...prev,
      instances: selectedInstances,
    }));
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User', href: paths.dashboard.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New User
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <UserTableToolbar
            filters={filters}
            onFilters={handleFilters}
            onSearchChange={handleSearchChange}
            searchTerm={searchTerm}
            roleOptions={roleOptions}
            instanceOptions={instanceOptions}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            {isFetching && <CircularProgress sx={{ position: 'absolute', top: 20, right: 20 }} />}

            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(checked, tableData.map((row) => row.id))
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, tableData.map((row) => row.id))
                  }
                />

                <TableBody>
                  {dataInPage.map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow([row.id])}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <div>
            Are you sure you want to delete <strong>{table.selected.length}</strong> items?
          </div>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(table.selected);
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

function applyFilter({  inputData, comparator, filters = {} }) {
  const { search, role, instances } = filters;

  if (!Array.isArray(inputData)) {
    console.error('Expected inputData to be an array but received:', inputData);
    return [];
  }

  let filteredData = [...inputData];
  filteredData = filteredData.sort((a, b) => comparator(a, b));


  // Filter by name
  if (search) {
    filteredData = filteredData.filter(
      (user) =>
        user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        user?.email?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by role if selected
  if (role.length > 0) {
    filteredData = filteredData.filter((user) => role.includes(user.role));
  }

  // Filter by instances if selected
  if (instances.length > 0) {
    filteredData = filteredData.filter((user) => instances.includes(user.instance));
  }

  return filteredData;
}
