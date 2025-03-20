// D:\biogas-app\client\src\pages\Nodes.jsx
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

function Nodes() {
  const [nodes, setNodes] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Форма для добавления/редактирования
  const [formData, setFormData] = useState({
    external_id: '',
    installation_date: '',
    digester_id: ''
  });
  const [editingId, setEditingId] = useState(null);

  const tableRef = useRef(null);

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = () => {
    axios.get('/api/nodes')
      .then(res => setNodes(res.data))
      .catch(err => console.error(err));
  };

  // Фильтрация по поиску (external_id, installation_date, digester_id)
  const filteredNodes = nodes.filter(n => {
    const search = searchValue.toLowerCase();
    return (
      n.external_id?.toLowerCase().includes(search) ||
      (n.installation_date && n.installation_date.toLowerCase().includes(search)) ||
      String(n.digester_id).includes(search)
    );
  });

  // Пагинация
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentData = filteredNodes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredNodes.length / pageSize);

  // Экспорт данных
  const exportXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredNodes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Nodes');
    XLSX.writeFile(workbook, 'nodes.xlsx');
  };

  const exportPDF = () => {
    html2canvas(tableRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('nodes.pdf');
    });
  };

  const exportPNG = () => {
    html2canvas(tableRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'nodes.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  const exportJPG = () => {
    html2canvas(tableRef.current, { backgroundColor: '#fff' }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'nodes.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    });
  };

  const exportSVG = () => {
    domtoimage.toSvg(tableRef.current).then(dataUrl => {
      const link = document.createElement('a');
      link.download = 'nodes.svg';
      link.href = dataUrl;
      link.click();
    });
  };

  // Добавление/редактирование
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/nodes/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('/api/nodes', formData);
      }
      setFormData({
        external_id: '',
        installation_date: '',
        digester_id: ''
      });
      fetchNodes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (node) => {
    setEditingId(node.id);
    setFormData({
      external_id: node.external_id || '',
      installation_date: node.installation_date ? node.installation_date.substring(0,10) : '',
      digester_id: node.digester_id || ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/nodes/${id}`);
      fetchNodes();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ mt: 10, ml: { xs: 0, sm: '220px' }, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Nodes
      </Typography>

      {/* Форма для добавления/редактирования */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? 'Edit Node' : 'Add Node'}
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
            label="Installation Date"
            variant="outlined"
            size="small"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.installation_date}
            onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
          />
          <TextField
            label="Digester ID"
            variant="outlined"
            size="small"
            type="number"
            value={formData.digester_id}
            onChange={(e) => setFormData({ ...formData, digester_id: e.target.value })}
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
        <Button
          variant="contained"
          sx={{ backgroundColor: '#2a9d8f' }}
          onClick={() => {
            setSearchValue('');
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
                <TableCell>Installation Date</TableCell>
                <TableCell>Digester ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((node) => (
                <TableRow key={node.id}>
                  <TableCell>{node.id}</TableCell>
                  <TableCell>{node.external_id}</TableCell>
                  <TableCell>{node.installation_date || 'N/A'}</TableCell>
                  <TableCell>{node.digester_id}</TableCell>
                  <TableCell>
                    <Button variant="text" onClick={() => handleEdit(node)}>
                      Edit
                    </Button>
                    <Button variant="text" onClick={() => handleDelete(node.id)}>
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
          {indexOfFirst + 1}–{Math.min(indexOfLast, filteredNodes.length)} of {filteredNodes.length}
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

export default Nodes;
