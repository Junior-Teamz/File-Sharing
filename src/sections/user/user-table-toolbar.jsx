import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function UserTableToolbar({
  filters = {},
  onFilters,
  roleOptions = [],
  instanceOptions = [], // New prop for instance options
}) {
  const popover = usePopover();
  const [searchTerm, setSearchTerm] = useState(filters.search || ''); // Local state for search input

  // Debounce the search input change using lodash debounce
  const debouncedSearch = useCallback(
    debounce((value) => {
      onFilters('search', value); // Call onFilters with debounced search value
    }, 1500),
    [onFilters]
  );

  const handleFilterSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value); // Update local search term
    debouncedSearch(value); // Call the debounced search function
  };

  const handleFilterRole = useCallback(
    (event) => {
      onFilters(
        'role',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterInstansi = useCallback(
    (event) => {
      onFilters(
        'instansi',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        {/* Role Filter */}
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Role</InputLabel>
          <Select
            multiple
            value={filters.role || []}
            onChange={handleFilterRole}
            input={<OutlinedInput label="Role" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {roleOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={(filters.role || []).includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Instansi Filter */}
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Instansi</InputLabel>
          <Select
            multiple
            value={filters.instansi || []} // Bind to filters.instansi
            onChange={handleFilterInstansi} // Handle instansi change
            input={<OutlinedInput label="Instansi" />}
            renderValue={(selected) => selected.join(', ')} // Use join to display selected values
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {instanceOptions.length > 0 ? (
              instanceOptions.map((option) => (
                <MenuItem key={option.id} value={option.name || ''}>
                  <Checkbox
                    disableRipple
                    size="small"
                    checked={(filters.instansi || []).includes(option.name || '')}
                  />
                  {option.name || 'Unnamed Instance'}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No instances available</MenuItem>
            )}
          </Select>
        </FormControl>

        {/* Search Input */}
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={searchTerm} // Bind input value to local searchTerm
            onChange={handleFilterSearch} // Handle input changes
            placeholder="Search by name or email..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Popover Menu */}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

UserTableToolbar.propTypes = {
  filters: PropTypes.shape({
    role: PropTypes.array,
    instansi: PropTypes.array, // New prop for instance filters
    search: PropTypes.string,
  }),
  onFilters: PropTypes.func.isRequired,
  roleOptions: PropTypes.arrayOf(PropTypes.string),
  instanceOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ), // New prop for instance options
};
