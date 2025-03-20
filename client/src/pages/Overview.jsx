// client/src/pages/Overview.jsx
import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack
} from '@mui/material';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import SearchIcon from '@mui/icons-material/Search';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
import axios from 'axios';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

function Overview() {
  // Для карты
  const [digesters, setDigesters] = useState([]);
  const [selectedDigester, setSelectedDigester] = useState(null);
  const [showMap, setShowMap] = useState(true);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: ' AIzaSyAMaDUBXsDuAm3VbT6cvoGSklR2Sgq9fN4' 
  });

  useEffect(() => {
    // Загружаем данные для маркеров (digesters)
    axios.get('/api/digesters')
      .then(res => setDigesters(res.data))
      .catch(err => console.error(err));
  }, []);

  // Центр карты (если есть данные)
  let center = { lat: 0, lng: 0 };
  if (digesters.length > 0) {
    center = {
      lat: parseFloat(digesters[0].lat),
      lng: parseFloat(digesters[0].lng)
    };
  }

  // Для таблицы Customers
  const [customers, setCustomers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios.get('/api/customers')
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err));
  };

  // Фильтрация клиентов
  const filteredCustomers = customers.filter(c => {
    if (statusFilter !== '') {
      if (String(c.status) !== statusFilter) return false;
    }
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

  // Экспорт данных
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

  return (
    <Box className="page-container" sx={{ mt: 10, ml: { xs: 0, sm: '220px' }, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Overview
      </Typography>

      {/* Кнопка переключения карты */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#2a9d8f', fontSize: '1rem', py: 1, px: 2 }}
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </Button>
      </Box>

      {/* Карта */}
      {showMap && isLoaded && (
        <Paper sx={{ border: '4px solid #2a9d8f', borderRadius: 2, mb: 3, overflow: 'hidden' }}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={5}
          >
            {digesters.map(d => (
              <Marker
                key={d.id}
                position={{
                  lat: parseFloat(d.lat),
                  lng: parseFloat(d.lng)
                }}
                onClick={() => setSelectedDigester(d)}
              />
            ))}
            {selectedDigester && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedDigester.lat),
                  lng: parseFloat(selectedDigester.lng)
                }}
                onCloseClick={() => setSelectedDigester(null)}
              >
                <Box>
                  <Typography variant="subtitle1">{selectedDigester.external_id}</Typography>
                  <Typography variant="body2">Type: {selectedDigester.type}</Typography>
                  <Typography variant="body2">
                    Lat: {selectedDigester.lat}, Lng: {selectedDigester.lng}
                  </Typography>
                </Box>
              </InfoWindow>
            )}
          </GoogleMap>
        </Paper>
      )}

      {/* Панель поиска и фильтра */}
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
          <InputLabel>All statuses</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            label="All statuses"
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
        {/* Кнопки экспорта */}
        <Stack direction="row" spacing={1}>
          <Button variant="contained" className="export-button" onClick={exportXLS}>XLS</Button>
          <Button variant="contained" className="export-button" onClick={exportPDF}>PDF</Button>
          <Button variant="contained" className="export-button" onClick={exportPNG}>PNG</Button>
          <Button variant="contained" className="export-button" onClick={exportJPG}>JPG</Button>
          <Button variant="contained" className="export-button" onClick={exportSVG}>SVG</Button>
        </Stack>
      </Paper>

      {/* Таблица с данными */}
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
                <TableCell>Last Data</TableCell>
                <TableCell>Status</TableCell>
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
                  <TableCell>{cust.last_data_at ? cust.last_data_at : 'Never'}</TableCell>
                  <TableCell>{cust.status === 1 ? 'Active' : 'Inactive'}</TableCell>
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

export default Overview;
