// client/src/components/CustomPagination.jsx
import React from 'react';
import { Box, Typography, Select, MenuItem, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

function CustomPagination({ totalRows, rowsPerPage, currentPage, onChangePage, onChangeRowsPerPage }) {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(totalRows, currentPage * rowsPerPage);
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 2 }}>
      <Typography variant="body2" sx={{ mr: 2 }}>Rows per page:</Typography>
      <Select
        value={rowsPerPage}
        onChange={(e) => onChangeRowsPerPage(Number(e.target.value))}
        size="small"
        sx={{ mr: 2 }}
      >
        {[5, 10, 20].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      <Typography variant="body2" sx={{ mr: 2 }}>
        {startRow}–{endRow} of {totalRows}
      </Typography>
      <IconButton 
        onClick={() => onChangePage(currentPage - 1)}
        disabled={currentPage === 1}
        size="small"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton 
        onClick={() => onChangePage(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        size="small"
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
}

export default CustomPagination;
