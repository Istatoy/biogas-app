// D:\biogas-app\client\src\pages\Digesters.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  IconButton,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
import axios from 'axios';

function Digesters() {
  const [digesters, setDigesters] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Форма для добавления/редактирования
  const [formData, setFormData] = useState({
    external_id: '',
    type: '',
    lat: '',
    lng: '',
    installation_date: '',
    installation_notes: '',
    total_digester_volume: '',
    digester_biogas_capacity: '',
    stove_rings_amount: '',
    external_reference: '',
    customer_id: ''
  });
  const [editingId, setEditingId] = useState(null);

  const tableRef = useRef(null);

  useEffect(() => {
    fetchDigesters();
  }, []);

  const fetchDigesters = () => {
    axios.get('/api/digesters')
      .then(res => setDigesters(res.data))
      .catch(err => console.error(err));
  };

  // Фильтрация по поиску (external_id, type, external_reference)
  const filteredDigesters = digesters.filter(d => {
    const search = searchValue.toLowerCase();
    return (
      d.external_id?.toLowerCase().includes(search) ||
      d.type?.toLowerCase().includes(search) ||
      d.external_reference?.toLowerCase().includes(search)
    );
  });

  // Пагинация
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentData = filteredDigesters.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDigesters.length / pageSize);

  // Экспорт данных
  const exportXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredDigesters);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Digesters');
    XLSX.writeFile(workbook, 'digesters.xlsx');
  };

  const exportPDF = () => {
    html2canvas(tableRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('digesters.pdf');
    });
  };

  const exportPNG = () => {
    html2canvas(tableRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'digesters.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  const exportJPG = () => {
    html2canvas(tableRef.current, { backgroundColor: '#fff' }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'digesters.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    });
  };

  const exportSVG = () => {
    domtoimage.toSvg(tableRef.current).then(dataUrl => {
      const link = document.createElement('a');
      link.download = 'digesters.svg';
      link.href = dataUrl;
      link.click();
    });
  };

  // Добавление/редактирование
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/digesters/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('/api/digesters', formData);
      }
      setFormData({
        external_id: '',
        type: '',
        lat: '',
        lng: '',
        installation_date: '',
        installation_notes: '',
        total_digester_volume: '',
        digester_biogas_capacity: '',
        stove_rings_amount: '',
        external_reference: '',
        customer_id: ''
      });
      fetchDigesters();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (digester) => {
    setEditingId(digester.id);
    setFormData({
      external_id: digester.external_id || '',
      type: digester.type || '',
      lat: digester.lat || '',
      lng: digester.lng || '',
      installation_date: digester.installation_date ? digester.installation_date.substring(0,10) : '',
      installation_notes: digester.installation_notes || '',
      total_digester_volume: digester.total_digester_volume || '',
      digester_biogas_capacity: digester.digester_biogas_capacity || '',
      stove_rings_amount: digester.stove_rings_amount || '',
      external_reference: digester.external_reference || '',
      customer_id: digester.customer_id || ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/digesters/${id}`);
      fetchDigesters();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ mt: 10, ml: { xs: 0, sm: '220px' }, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Digesters
      </Typography>

      {/* Форма для добавления/редактирования */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? 'Edit Digester' : 'Add Digester'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="External ID"
            variant="outlined"
            size="small"
            required
            value={formData.external_id}
            onChange={(e) => setFormData({ ...formData, external_id: e.target.value })}
          />
          <TextField
            label="Type"
            variant="outlined"
            size="small"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <TextField
            label="Latitude"
            variant="outlined"
            size="small"
            type="number"
            value={formData.lat}
            onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
          />
          <TextField
            label="Longitude"
            variant="outlined"
            size="small"
            type="number"
            value={formData.lng}
            onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
          />
          <TextField
            label="Installation Date"
            variant="outlined"
            size="small"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.installation_date}
            onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
          />
          <TextField
            label="Installation Notes"
            variant="outlined"
            size="small"
            value={formData.installation_notes}
            onChange={(e) => setFormData({ ...formData, installation_notes: e.target.value })}
          />
          <TextField
            label="Total Volume"
            variant="outlined"
            size="small"
            type="number"
            value={formData.total_digester_volume}
            onChange={(e) => setFormData({ ...formData, total_digester_volume: e.target.value })}
          />
          <TextField
            label="Biogas Capacity"
            variant="outlined"
            size="small"
            type="number"
            value={formData.digester_biogas_capacity}
            onChange={(e) => setFormData({ ...formData, digester_biogas_capacity: e.target.value })}
          />
          <TextField
            label="Stove Rings"
            variant="outlined"
            size="small"
            type="number"
            value={formData.stove_rings_amount}
            onChange={(e) => setFormData({ ...formData, stove_rings_amount: e.target.value })}
          />
          <TextField
            label="External Reference"
            variant="outlined"
            size="small"
            value={formData.external_reference}
            onChange={(e) => setFormData({ ...formData, external_reference: e.target.value })}
          />
          <TextField
            label="Customer ID"
            variant="outlined"
            size="small"
            type="number"
            value={formData.customer_id}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
          />
          <Button variant="contained" sx={{ backgroundColor: '#2a9d8f' }} type="submit">
            {editingId ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Paper>

      {/* Панель поиска и экспорта */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: 1, p: 1, boxShadow: 1 }}>
          <SearchIcon sx={{ color: '#2a9d8f', mr: 1 }} />
          <TextField
            variant="standard"
            placeholder="search..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1);
            }}
            InputProps={{ disableUnderline: true }}
            sx={{ fontFamily: 'Roboto', fontSize: '0.75rem' }}
          />
        </Box>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#2a9d8f', fontSize: '0.75rem' }}
          onClick={() => {
            setSearchValue('');
            setCurrentPage(1);
          }}
        >
          Clear
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={exportXLS} sx={{ fontSize: '0.75rem' }}>XLS</Button>
          <Button variant="contained" onClick={exportPDF} sx={{ fontSize: '0.75rem' }}>PDF</Button>
          <Button variant="contained" onClick={exportPNG} sx={{ fontSize: '0.75rem' }}>PNG</Button>
          <Button variant="contained" onClick={exportJPG} sx={{ fontSize: '0.75rem' }}>JPG</Button>
          <Button variant="contained" onClick={exportSVG} sx={{ fontSize: '0.75rem' }}>SVG</Button>
        </Stack>
      </Paper>

      {/* Таблица с уменьшенным размером шрифта */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Box ref={tableRef}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontSize: '0.75rem' }}>ID</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>External ID</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Type</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Latitude</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Longitude</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Installation Date</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Notes</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Total Volume</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Biogas Capacity</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Stove Rings</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>External Ref</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Customer ID</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((digester) => (
                <TableRow key={digester.id}>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{digester.id}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{digester.external_id}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{digester.type}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{digester.lat}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{digester.lng}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{digester.installation_date || 'N/A'}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{digester.installation_notes}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{digester.total_digester_volume}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{digester.digester_biogas_capacity}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{digester.stove_rings_amount}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{digester.external_reference}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{digester.customer_id}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>
                    <Button variant="text" sx={{ fontSize: '0.7rem' }} onClick={() => handleEdit(digester)}>
                      Edit
                    </Button>
                    <Button variant="text" sx={{ fontSize: '0.7rem' }} onClick={() => handleDelete(digester.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>

      {/* Пагинация */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
        <Typography variant="body2" sx={{ mr: 2, fontSize: '0.75rem' }}>Rows per page:</Typography>
        <FormControl variant="standard" sx={{ minWidth: 60, mr: 2 }}>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            sx={{ fontSize: '0.75rem' }}
          >
            <MenuItem value={5} sx={{ fontSize: '0.75rem' }}>5</MenuItem>
            <MenuItem value={10} sx={{ fontSize: '0.75rem' }}>10</MenuItem>
            <MenuItem value={20} sx={{ fontSize: '0.75rem' }}>20</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ mr: 2, fontSize: '0.75rem' }}>
          {indexOfFirst + 1}–{Math.min(indexOfLast, filteredDigesters.length)} of {filteredDigesters.length}
        </Typography>
        <IconButton
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          size="small"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          size="small"
        >
          <KeyboardArrowRight />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Digesters;
