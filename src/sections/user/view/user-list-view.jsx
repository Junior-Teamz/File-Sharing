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
  Box,
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
import { useSnackbar } from 'notistack';
import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from 'src/theme/css';

const TABLE_HEAD = [
  { id: 'name', label: 'Nama', width: 180 },
  { id: 'email', label: 'Email', width: 240 },
  { id: 'instance', label: 'Instansi', width: 180 },
  { id: 'roles', label: 'Role', width: 180 },
  { id: 'action', label: 'Aksi', width: 120 },
];

const DEBOUNCE_DELAY = 1500;

const defaultFilters = {
  name: '',
  roles: [], // Mengganti role menjadi roles
  instances: [],
};

// Define allowed roles explicitly
const allowedRoles = ['user', 'admin', 'superadmin'];

export default function UserListView() {
  const theme = useTheme();
  const table = useTable();
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
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
    allowedInstances: instanceOptions, // Passing allowed instances dynamically
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;
  const notFound = !dataFiltered.length;

  const { mutate: deleteUser } = useDeleteUser({
    onSuccess: () => {
      enqueueSnackbar('User Berhasil Dihapus', { variant: 'success' });
      refetch();
      confirm.onFalse();
    },
    onError: (error) => {
      enqueueSnackbar(`Gagal menghapus user: ${error.message}`, { variant: 'error' });
    },
  });

  const handleDeleteRow = useCallback((ids) => deleteUser(ids), [deleteUser]);

  useEffect(() => {
    refetch();
  }, [filters]);

  const handleFilterRoles = (selectedRoles) => {
    setFilters((prev) => ({
      ...prev,
      roles: selectedRoles, // Mengganti role menjadi roles
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
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            ...bgGradient({
              color: alpha(
                theme.palette.background.paper,
                theme.palette.mode === 'light' ? 0.8 : 0.8
              ),
              imgUrl: '/assets/background/overlay_3.jpg',
            }),
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            position: 'absolute',
            filter: 'blur(20px)',
            WebkitFilter: 'blur(20px)',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        />
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Daftar User"
            links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Daftar User' }]}
            action={
              <Button
                component={RouterLink}
                href={paths.dashboard.user.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Buat User Baru
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
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
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
                      table.onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id)
                      )
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
              Apa kamu yakin hapus <strong>{table.selected.length}</strong> User?
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
              Hapus
            </Button>
          }
        />
      </Box>
    </>
  );
}

function applyFilter({ inputData, comparator, filters = {} }) {
  const { search, roles, instances } = filters; // Mengganti role menjadi roles

  if (!Array.isArray(inputData)) {
    return [];
  }

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData = stabilizedThis.map((el) => el[0]);

  // Filter by name
  if (search) {
    filteredData = filteredData.filter(
      (user) =>
        user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        user?.email?.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (roles.length > 0) {
    filteredData = filteredData.filter((user) => {
      const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles]; // Memastikan roles adalah array
      return roles.some((selectedRole) =>
        userRoles.some((role) => role.toLowerCase() === selectedRole.toLowerCase())
      );
    });
  }

  if (instances.length > 0) {
    filteredData = filteredData.filter((user) => {
      const userInstance =
        typeof user.instances === 'string' ? user.instances : String(user.instances);

      return instances.some(
        (selectedInstances) => selectedInstances.toLowerCase() === userInstance.toLowerCase()
      );
    });
  }

  return filteredData;
}
