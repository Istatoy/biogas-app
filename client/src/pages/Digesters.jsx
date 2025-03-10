// client/src/pages/Digesters.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/table.css';

function Digesters() {
  const [digesters, setDigesters] = useState([]);
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

  const fetchDigesters = async () => {
    try {
      const res = await axios.get('/api/digesters');
      setDigesters(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
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
      external_id: digester.external_id,
      type: digester.type,
      lat: digester.lat,
      lng: digester.lng,
      installation_date: digester.installation_date,
      installation_notes: digester.installation_notes,
      total_digester_volume: digester.total_digester_volume,
      digester_biogas_capacity: digester.digester_biogas_capacity,
      stove_rings_amount: digester.stove_rings_amount,
      external_reference: digester.external_reference,
      customer_id: digester.customer_id
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

  // Экспорт таблицы в PDF
  const exportPDF = () => {
    html2canvas(tableRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', 'a4');
      const imgProps= pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('digesters.pdf');
    });
  };

  // Экспорт таблицы в PNG (аналогично можно сделать для JPG)
  const exportPNG = () => {
    html2canvas(tableRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'digesters.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  // CSV экспорт с помощью react-csv
  const csvHeaders = [
    { label: 'ID', key: 'id' },
    { label: 'External ID', key: 'external_id' },
    { label: 'Type', key: 'type' },
    { label: 'Latitude', key: 'lat' },
    { label: 'Longitude', key: 'lng' },
    { label: 'Installation Date', key: 'installation_date' },
    { label: 'Notes', key: 'installation_notes' }
    // Добавьте остальные поля по необходимости
  ];

  return (
    <div className="page-container">
      <h1>Digesters</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <input type="text" name="external_id" placeholder="External ID" value={formData.external_id} onChange={handleChange} required />
        <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />
        <input type="number" step="any" name="lat" placeholder="Latitude" value={formData.lat} onChange={handleChange} required />
        <input type="number" step="any" name="lng" placeholder="Longitude" value={formData.lng} onChange={handleChange} required />
        <input type="date" name="installation_date" placeholder="Installation Date" value={formData.installation_date} onChange={handleChange} />
        <input type="text" name="installation_notes" placeholder="Installation Notes" value={formData.installation_notes} onChange={handleChange} />
        <input type="number" step="any" name="total_digester_volume" placeholder="Total Volume" value={formData.total_digester_volume} onChange={handleChange} />
        <input type="number" step="any" name="digester_biogas_capacity" placeholder="Biogas Capacity" value={formData.digester_biogas_capacity} onChange={handleChange} />
        <input type="number" name="stove_rings_amount" placeholder="Stove Rings" value={formData.stove_rings_amount} onChange={handleChange} />
        <input type="text" name="external_reference" placeholder="External Reference" value={formData.external_reference} onChange={handleChange} />
        <input type="number" name="customer_id" placeholder="Customer ID" value={formData.customer_id} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <div className="download-buttons">
        <CSVLink data={digesters} headers={csvHeaders} filename="digesters.csv">
          Download CSV
        </CSVLink>
        <button onClick={exportPDF}>Download PDF</button>
        <button onClick={exportPNG}>Download PNG</button>
        {/* Для JPG и SVG можно реализовать аналогичные функции */}
      </div>

      <div ref={tableRef}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>External ID</th>
              <th>Type</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Installation Date</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {digesters.map(d => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.external_id}</td>
                <td>{d.type}</td>
                <td>{d.lat}</td>
                <td>{d.lng}</td>
                <td>{d.installation_date}</td>
                <td>{d.installation_notes}</td>
                <td>
                  <button onClick={() => handleEdit(d)}>Edit</button>
                  <button onClick={() => handleDelete(d.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Digesters;
