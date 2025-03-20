// client/src/pages/Customers.jsx
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

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Форма для добавления/редактирования (если нужно)
  const [formData, setFormData] = useState({
    external_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    // например, поля: contact_preference, system_status, gender, last_data_at, status ...
    status: '1'
  });
  const [editingId, setEditingId] = useState(null);

  const tableRef = useRef(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios.get('/api/customers')
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err));
  };

  // Фильтрация (по статусу, по поиску)
  const filteredCustomers = customers.filter(c => {
    // фильтр по статусу
    if (statusFilter !== '') {
      if (String(c.status) !== statusFilter) return false;
    }
    // поиск (external_id, first_name+last_name, email)
    const search = searchValue.toLowerCase();
    const fullName = (c.first_name + ' ' + c.last_name).toLowerCase();
    if (
      !c.external_id?.toLowerCase().includes(search) &&
      !fullName.includes(search) &&
      !c.email?.toLowerCase().includes(search)
    ) {
      return false;
    }
    return true;
  });

  // Пагинация
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentData = filteredCustomers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  // Экспорт
  const exportXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCustomers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, 'customers.xlsx');
  };

  const exportPDF = () => {
    html2canvas(tableRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('customers.pdf');
    });
  };

  const exportPNG = () => {
    html2canvas(tableRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'customers.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  const exportJPG = () => {
    html2canvas(tableRef.current, { backgroundColor: '#fff' }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'customers.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    });
  };

  const exportSVG = () => {
    domtoimage.toSvg(tableRef.current).then(dataUrl => {
      const link = document.createElement('a');
      link.download = 'customers.svg';
      link.href = dataUrl;
      link.click();
    });
  };

  // Добавление/редактирование (если нужно)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // обновление
        await axios.put(`/api/customers/${editingId}`, formData);
        setEditingId(null);
      } else {
        // добавление
        await axios.post('/api/customers', formData);
      }
      // сброс формы
      setFormData({
        external_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        status: '1'
      });
      fetchCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (cust) => {
    setEditingId(cust.id);
    setFormData({
      external_id: cust.external_id || '',
      first_name: cust.first_name || '',
      last_name: cust.last_name || '',
      email: cust.email || '',
      phone: cust.phone || '',
      status: String(cust.status || '1')
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ mt: 10, ml: { xs: 0, sm: '220px' }, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>

      {/* Форма для добавления (если нужно) */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? 'Edit Customer' : 'Add Customer'}
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
            label="First Name"
            variant="outlined"
            size="small"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            size="small"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            label="Phone"
            variant="outlined"
            size="small"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {/* можно добавить поля system_status, gender, last_data_at, etc. */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="0">Inactive</MenuItem>
            </Select>
          </FormControl>

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
        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="1">Active</MenuItem>
            <MenuItem value="0">Inactive</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#2a9d8f' }}
          onClick={() => {
            setSearchValue('');
            setStatusFilter('');
            setCurrentPage(1);
          }}
        >
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

      {/* Таблица */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Box ref={tableRef}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>External ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Last Data At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((cust) => (
                <TableRow key={cust.id}>
                  <TableCell>{cust.id}</TableCell>
                  <TableCell>{cust.external_id}</TableCell>
                  <TableCell>{cust.first_name} {cust.last_name}</TableCell>
                  <TableCell>{cust.email}</TableCell>
                  <TableCell>{cust.phone}</TableCell>
                  <TableCell>{cust.last_data_at || 'Never'}</TableCell>
                  <TableCell>{cust.status === 1 ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <Button variant="text" onClick={() => handleEdit(cust)}>
                      Edit
                    </Button>
                    <Button variant="text" onClick={() => handleDelete(cust.id)}>
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
        <Typography variant="body2" sx={{ mr: 2 }}>Rows per page:</Typography>
        <FormControl variant="standard" sx={{ minWidth: 60, mr: 2 }}>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {indexOfFirst + 1}–{Math.min(indexOfLast, filteredCustomers.length)} of {filteredCustomers.length}
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

export default Customers;
