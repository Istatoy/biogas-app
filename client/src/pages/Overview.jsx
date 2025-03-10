// client/src/pages/Overview.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
import '../styles/overview.css';

// Параметры карты (размер + зелёная рамка)
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  border: '4px solid darkgreen',
  borderRadius: '6px'
};

function Overview() {
  // -------------------- Карта --------------------
  const [digesters, setDigesters] = useState([]);
  const [selectedDigester, setSelectedDigester] = useState(null);
  const [showMap, setShowMap] = useState(true); // Hide/Show

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAMaDUBXsDuAm3VbT6cvoGSklR2Sgq9fN4'
  });

  useEffect(() => {
    // Загружаем digesters (для маркеров)
    axios.get('/api/digesters')
      .then(res => setDigesters(res.data))
      .catch(err => console.error(err));
  }, []);

  // -------------------- Таблица Customers (read-only) --------------------
  const [customers, setCustomers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const tableRef = useRef(null); // для экспорта PDF/PNG/JPG/SVG

  useEffect(() => {
    // Загружаем список клиентов
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios.get('/api/customers')
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err));
  };

  // Фильтрация/поиск (на клиенте)
  const filteredCustomers = customers.filter(c => {
    // Фильтр по статусу (0 или 1)
    if (statusFilter !== '') {
      if (String(c.status) !== statusFilter) return false;
    }
    // Поиск по external_id, имени, email
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

  // Центр карты
  let center = { lat: 0, lng: 0 };
  if (digesters.length > 0) {
    center = {
      lat: parseFloat(digesters[0].lat),
      lng: parseFloat(digesters[0].lng)
    };
  }

  return (
    <div className="page-container">
      <h2>Overview</h2>

      {/* Кнопка Hide/Show Map */}
      <div className="map-actions">
        <button onClick={() => setShowMap(!showMap)}>
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>

      {/* Карта (только если showMap = true) */}
      {showMap && isLoaded && (
        <div className="map-wrapper">
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
                <div>
                  <h3>{selectedDigester.external_id}</h3>
                  <p>Type: {selectedDigester.type}</p>
                  <p>Lat: {selectedDigester.lat}, Lng: {selectedDigester.lng}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      )}

      {/* Поиск и фильтр */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by external_id, name, or email"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
        <button onClick={() => {
          setSearchValue('');
          setStatusFilter('');
          setCurrentPage(1);
        }}>
          Clear
        </button>

        <div className="download-buttons">
          <button onClick={exportXLS}>XLS</button>
          <button onClick={exportPDF}>PDF</button>
          <button onClick={exportPNG}>PNG</button>
          <button onClick={exportJPG}>JPG</button>
          <button onClick={exportSVG}>SVG</button>
        </div>
      </div>

      {/* Таблица (read-only) */}
      <div className="table-container" ref={tableRef}>
        <p className="table-info">
          {filteredCustomers.length} Customer(s) found
        </p>
        <table className="overview-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>External ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Last Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((cust) => (
              <tr key={cust.id}>
                <td>{cust.id}</td>
                <td>{cust.external_id}</td>
                <td>{cust.first_name} {cust.last_name}</td>
                <td>{cust.email}</td>
                <td>{cust.phone}</td>
                <td>{cust.last_data_at ? cust.last_data_at : 'Never'}</td>
                <td>{cust.status === 1 ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      <div className="pagination-container">
        <div className="rows-per-page">
          <span>Rows per page: </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <div className="page-info">
          {indexOfFirst + 1}–
          {Math.min(indexOfLast, filteredCustomers.length)} of {filteredCustomers.length}
        </div>
        <div className="page-buttons">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={page === currentPage ? 'active' : ''}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Overview;
