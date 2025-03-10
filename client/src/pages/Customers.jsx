// client/src/pages/Customers.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
import '../styles/table.css';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Форма CRUD
  const [formData, setFormData] = useState({
    external_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    contact_preference: '',
    system_status: '',
    gender: '',
    last_data_at: '',
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

  // Фильтрация/поиск
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

  // Изменение формы
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Создание/Обновление
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Обновление
        await axios.put(`/api/customers/${editingId}`, formData);
        setEditingId(null);
      } else {
        // Создание
        await axios.post('/api/customers', formData);
      }
      // Очистка формы
      setFormData({
        external_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        contact_preference: '',
        system_status: '',
        gender: '',
        last_data_at: '',
        status: '1'
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  // Редактирование (заполнение формы)
  const handleEdit = (cust) => {
    setEditingId(cust.id);
    setFormData({
      external_id: cust.external_id || '',
      first_name: cust.first_name || '',
      last_name: cust.last_name || '',
      email: cust.email || '',
      phone: cust.phone || '',
      contact_preference: cust.contact_preference || '',
      system_status: cust.system_status || '',
      gender: cust.gender || '',
      last_data_at: cust.last_data_at ? cust.last_data_at.substring(0, 16) : '',
      status: cust.status?.toString() || '1'
    });
  };

  // Удаление
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

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

  return (
    <div className="page-container">
      <h2>Customers</h2>

      {/* Форма для CRUD */}
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="external_id"
          placeholder="External ID"
          value={formData.external_id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="contact_preference"
          placeholder="Contact Pref"
          value={formData.contact_preference}
          onChange={handleChange}
        />
        <input
          type="text"
          name="system_status"
          placeholder="System Status"
          value={formData.system_status}
          onChange={handleChange}
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={formData.gender}
          onChange={handleChange}
        />
        <label>
          Last Data At:
          <input
            type="datetime-local"
            name="last_data_at"
            value={formData.last_data_at}
            onChange={handleChange}
          />
        </label>
        <label>
          Status:
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </label>

        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      {/* Панель поиска/фильтра */}
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
      </div>

      {/* Кнопки экспорта */}
      <div className="download-buttons">
        <button onClick={exportXLS}>XLS</button>
        <button onClick={exportPDF}>PDF</button>
        <button onClick={exportPNG}>PNG</button>
        <button onClick={exportJPG}>JPG</button>
        <button onClick={exportSVG}>SVG</button>
      </div>

      {/* Таблица + пагинация */}
      <div ref={tableRef}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>External ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Last Data</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.external_id}</td>
                <td>{c.first_name} {c.last_name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.last_data_at || 'Never'}</td>
                <td>{c.status === 1 ? 'Active' : 'Inactive'}</td>
                <td>
                  <button onClick={() => handleEdit(c)}>Edit</button>
                  <button onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
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

export default Customers;
