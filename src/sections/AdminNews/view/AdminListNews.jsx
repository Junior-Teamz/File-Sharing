import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import React from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomPopover from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

export default function AdminListNews() {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'News List', href: paths.dashboard.AdminNews },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.instance.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Instance
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Scrollbar>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Thumbnail</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              {/* <TableBody>
                  {instances
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((instance) => (
                      <TableRow key={instance.id}>
                        <TableCell>{instance.name}</TableCell>

                        <TableCell sx={{ maxWidth: 200, padding: '0', whiteSpace: 'nowrap' }}>
                          <div
                            style={{ overflowX: 'auto', maxWidth: '100%', display: 'inline-block' }}
                          >
                            {instance.address}
                          </div>
                        </TableCell>

                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          <Tooltip title="More Actions" placement="top">
                            <IconButton onClick={(event) => handlePopoverOpen(event, instance.id)}>
                              <Iconify icon="eva:more-vertical-fill" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody> */}
            </Table>
          </TableContainer>
          {/* <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={instances.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
        </Scrollbar>

        {/* Modal for editing instance */}
        {/* <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
          <DialogTitle>Edit Instance</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleEditSubmit)}>
              <DialogContentText sx={{ mb: 3 }}>
                Silahkan masukkan data yang ingin diubah.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                name="name"
                label="Nama Instance"
                type="text"
                fullWidth
                variant="outlined"
                {...register('name')}
              />

              <TextField
                margin="dense"
                id="address"
                name="address"
                label="Address Instance"
                type="text"
                fullWidth
                variant="outlined"
                {...register('address')}
              />
              <DialogActions>
                <Button variant="outlined" onClick={handleEditDialogClose}>
                  Cancel
                </Button>
                <Button variant="outlined" type="submit">
                  {loadingEdit ? 'Editing' : 'Edit'}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog> */}

        {/* <CustomPopover
          open={popover.open} // boolean for open
          anchorEl={popover.anchorEl} // element for anchorEl
          onClose={handlePopoverClose}
          arrow="right-top"
          sx={{ width: 140 }}
        >
          <MenuItem onClick={() => handleDelete(popover.currentId)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
          <MenuItem onClick={() => handleEdit(popover.currentId)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </CustomPopover> */}
      </Container>
    </>
  );
}
