// client/src/pages/Reports.jsx
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
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
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

function Reports() {
  const [reports, setReports] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Форма для CRUD (если требуется)
  const [formData, setFormData] = useState({
    timestamp: '',
    static_pressure_pa: '',
    flow_lph: '',
    gas_consumption_l: '',
    battery_v: '',
    battery_a: '',
    solar_voltage: '',
    temperature_degc: '',
    temp_ext_degc: '',
    rssi_db: '',
    node_id: ''
  });
  const [editingId, setEditingId] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    axios.get('/api/reports')
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  };

  // Фильтрация по поиску (например, по timestamp)
  const filteredReports = reports.filter(r => {
    const search = searchValue.toLowerCase();
    return r.timestamp?.toString().toLowerCase().includes(search);
  });

  // Пагинация
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentData = filteredReports.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredReports.length / pageSize);

  // Экспорт
  const exportXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredReports);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
    XLSX.writeFile(workbook, 'reports.xlsx');
  };

  const exportPDF = () => {
    html2canvas(tableRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('reports.pdf');
    });
  };

  const exportPNG = () => {
    html2canvas(tableRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'reports.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  const exportJPG = () => {
    html2canvas(tableRef.current, { backgroundColor: '#fff' }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'reports.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    });
  };

  const exportSVG = () => {
    domtoimage.toSvg(tableRef.current).then(dataUrl => {
      const link = document.createElement('a');
      link.download = 'reports.svg';
      link.href = dataUrl;
      link.click();
    });
  };

  // CRUD функции
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/reports/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('/api/reports', formData);
      }
      setFormData({
        timestamp: '',
        static_pressure_pa: '',
        flow_lph: '',
        gas_consumption_l: '',
        battery_v: '',
        battery_a: '',
        solar_voltage: '',
        temperature_degc: '',
        temp_ext_degc: '',
        rssi_db: '',
        node_id: ''
      });
      fetchReports();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (r) => {
    setEditingId(r.id);
    setFormData({
      timestamp: r.timestamp || '',
      static_pressure_pa: r.static_pressure_pa || '',
      flow_lph: r.flow_lph || '',
      gas_consumption_l: r.gas_consumption_l || '',
      battery_v: r.battery_v || '',
      battery_a: r.battery_a || '',
      solar_voltage: r.solar_voltage || '',
      temperature_degc: r.temperature_degc || '',
      temp_ext_degc: r.temp_ext_degc || '',
      rssi_db: r.rssi_db || '',
      node_id: r.node_id || ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/reports/${id}`);
      fetchReports();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ mt: 10, ml: { xs: 0, sm: '220px' }, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      {/* Форма для добавления/редактирования */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? 'Edit Report' : 'Add Report'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Timestamp"
            variant="outlined"
            size="small"
            type="datetime-local"
            required
            value={formData.timestamp}
            onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Static Pressure"
            variant="outlined"
            size="small"
            type="number"
            value={formData.static_pressure_pa}
            onChange={(e) => setFormData({ ...formData, static_pressure_pa: e.target.value })}
          />
          <TextField
            label="Flow"
            variant="outlined"
            size="small"
            type="number"
            value={formData.flow_lph}
            onChange={(e) => setFormData({ ...formData, flow_lph: e.target.value })}
          />
          <TextField
            label="Gas Consumption"
            variant="outlined"
            size="small"
            type="number"
            value={formData.gas_consumption_l}
            onChange={(e) => setFormData({ ...formData, gas_consumption_l: e.target.value })}
          />
          <TextField
            label="Battery V"
            variant="outlined"
            size="small"
            type="number"
            value={formData.battery_v}
            onChange={(e) => setFormData({ ...formData, battery_v: e.target.value })}
          />
          <TextField
            label="Battery A"
            variant="outlined"
            size="small"
            type="number"
            value={formData.battery_a}
            onChange={(e) => setFormData({ ...formData, battery_a: e.target.value })}
          />
          <TextField
            label="Solar Voltage"
            variant="outlined"
            size="small"
            type="number"
            value={formData.solar_voltage}
            onChange={(e) => setFormData({ ...formData, solar_voltage: e.target.value })}
          />
          <TextField
            label="Temp (°C)"
            variant="outlined"
            size="small"
            type="number"
            value={formData.temperature_degc}
            onChange={(e) => setFormData({ ...formData, temperature_degc: e.target.value })}
          />
          <TextField
            label="Ext Temp (°C)"
            variant="outlined"
            size="small"
            type="number"
            value={formData.temp_ext_degc}
            onChange={(e) => setFormData({ ...formData, temp_ext_degc: e.target.value })}
          />
          <TextField
            label="RSSI"
            variant="outlined"
            size="small"
            type="number"
            value={formData.rssi_db}
            onChange={(e) => setFormData({ ...formData, rssi_db: e.target.value })}
          />
          <TextField
            label="Node ID"
            variant="outlined"
            size="small"
            type="number"
            required
            value={formData.node_id}
            onChange={(e) => setFormData({ ...formData, node_id: e.target.value })}
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
            sx={{ fontFamily: 'Roboto' }}
          />
        </Box>
        <Button variant="contained" sx={{ backgroundColor: '#2a9d8f' }} onClick={() => {
          setSearchValue('');
          setCurrentPage(1);
        }}>
          Clear
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={exportXLS}>XLS</Button>
          <Button variant="contained" onClick={exportPDF}>PDF</Button>
          <Button variant="contained" onClick={exportPNG}>PNG</Button>
          <Button variant="contained" onClick={exportJPG}>JPG</Button>
          <Button variant="contained" onClick={exportSVG}>SVG</Button>
        </Stack>
      </Paper>

      
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Box ref={tableRef}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Static Pressure</TableCell>
              <TableCell>Flow</TableCell>
              <TableCell>Gas Consumption</TableCell>
              <TableCell>Battery V</TableCell>
              <TableCell>Battery A</TableCell>
              <TableCell>Solar Voltage</TableCell>
              <TableCell>Temp</TableCell>
              <TableCell>Ext Temp</TableCell>
              <TableCell>RSSI</TableCell>
              <TableCell>Node ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                  {currentData.map(r => (
                    <TableRow key={r.id}>
                      <TableCell>{r.id}</TableCell>
                      <TableCell>{r.timestamp}</TableCell>
                      <TableCell>{r.static_pressure_pa}</TableCell>
                      <TableCell>{r.flow_lph}</TableCell>
                      <TableCell>{r.gas_consumption_l}</TableCell>
                      <TableCell>{r.battery_v}</TableCell>
                      <TableCell>{r.battery_a}</TableCell>
                      <TableCell>{r.solar_voltage}</TableCell>
                      <TableCell>{r.temperature_degc}</TableCell>
                      <TableCell>{r.temp_ext_degc}</TableCell>
                      <TableCell>{r.rssi_db}</TableCell>
                      <TableCell>{r.node_id}</TableCell>
                      <TableCell>
                        <Button variant="text" onClick={() => handleEdit(r)}>Edit</Button>
                        <Button variant="text" onClick={() => handleDelete(r.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </TableContainer>
        

      {/* Пагинация */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
        <Typography variant="body2" sx={{ mr: 2 }}>Rows per page:</Typography>
        <FormControl variant="standard" sx={{ minWidth: 60, mr: 2 }}>
          <Select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {indexOfFirst + 1}–{Math.min(indexOfLast, filteredReports.length)} of {filteredReports.length}
        </Typography>
        <IconButton onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} size="small">
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} size="small">
          <KeyboardArrowRight />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Reports;
