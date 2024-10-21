import React, { useState } from 'react';
import {
  Button,
  Container,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableBody,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
} from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomPopover from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { useDeleteLegal, useFetchNews } from './fetchNews';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminListNews() {
  const settings = useSettingsContext();
  const { data: newsData, isLoading } = useFetchNews();
  const deleteNews = useDeleteLegal();
  const { enqueueSnackbar } = useSnackbar();
  const useClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [popover, setPopover] = useState({ open: false, anchorEl: null, currentId: null });

  // Fallback to an empty array if newsData is undefined
  const filteredNews = (newsData?.data?.data || []).filter((news) =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await deleteNews.mutateAsync(id);
      enqueueSnackbar('Berita berhasil dihapus', { variant: 'success' });
      useClient.invalidateQueries({ queryKey: ['list.news'] });
    } catch {
      enqueueSnackbar('Gagal menghapus berita', { variant: 'error' });
    }
  };

  const handlePopoverOpen = (event, id) => {
    setPopover({ open: true, anchorEl: event.currentTarget, currentId: id });
  };

  const handlePopoverClose = () => {
    setPopover({ open: false, anchorEl: null, currentId: null });
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Daftar Berita', href: paths.dashboard.AdminNews },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.AdminNews.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Buat Berita Baru
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TextField
        variant="outlined"
        placeholder="Search News..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Scrollbar>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Thumbnail</TableCell>
                <TableCell>Judul</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredNews.length > 0 ? (
                filteredNews
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(({ id, title, content, status, thumbnail_url }) => (
                    <TableRow key={id}>
                      <TableCell>
                        <img src={thumbnail_url} alt={title} style={{ width: '100px' }} />
                      </TableCell>
                      <TableCell>
                        <span dangerouslySetInnerHTML={{ __html: title }} />
                      </TableCell>
                      <TableCell>
                        <span dangerouslySetInnerHTML={{ __html: content }} />
                      </TableCell>
                      <TableCell>{status}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="More Actions" placement="top">
                          <IconButton onClick={(event) => handlePopoverOpen(event, id)}>
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Tidak ada berita
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredNews.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Scrollbar>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={handlePopoverClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem onClick={() => handleDelete(popover.currentId)} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" /> Hapus
        </MenuItem>
        <MenuItem onClick={() => RouterLink.push(`/edit/${popover.currentId}`)}>
          <Iconify icon="solar:pen-bold" /> Edit
        </MenuItem>
      </CustomPopover>
    </Container>
  );
}
