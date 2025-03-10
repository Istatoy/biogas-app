// client/src/pages/Reports.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/table.css';

function Reports() {
  const [reports, setReports] = useState([]);
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

  const fetchReports = async () => {
    try {
      const res = await axios.get('/api/reports');
      setReports(res.data);
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

  const handleEdit = (report) => {
    setEditingId(report.id);
    setFormData({
      timestamp: report.timestamp,
      static_pressure_pa: report.static_pressure_pa,
      flow_lph: report.flow_lph,
      gas_consumption_l: report.gas_consumption_l,
      battery_v: report.battery_v,
      battery_a: report.battery_a,
      solar_voltage: report.solar_voltage,
      temperature_degc: report.temperature_degc,
      temp_ext_degc: report.temp_ext_degc,
      rssi_db: report.rssi_db,
      node_id: report.node_id
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

  const exportPDF = () => {
    html2canvas(tableRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', 'a4');
      const imgProps= pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
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

  const csvHeaders = [
    { label: 'ID', key: 'id' },
    { label: 'Timestamp', key: 'timestamp' },
    { label: 'Static Pressure', key: 'static_pressure_pa' },
    // Добавьте остальные поля по необходимости
  ];

  return (
    <div className="page-container">
      <h1>Reports</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <input type="datetime-local" name="timestamp" value={formData.timestamp} onChange={handleChange} required />
        <input type="number" step="any" name="static_pressure_pa" placeholder="Static Pressure (Pa)" value={formData.static_pressure_pa} onChange={handleChange} required />
        {/* Остальные поля формы */}
        <input type="number" name="node_id" placeholder="Node ID" value={formData.node_id} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <div className="download-buttons">
        <CSVLink data={reports} headers={csvHeaders} filename="reports.csv">
          Download CSV
        </CSVLink>
        <button onClick={exportPDF}>Download PDF</button>
        <button onClick={exportPNG}>Download PNG</button>
      </div>

      <div ref={tableRef}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>Static Pressure</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.timestamp}</td>
                <td>{r.static_pressure_pa}</td>
                <td>
                  <button onClick={() => handleEdit(r)}>Edit</button>
                  <button onClick={() => handleDelete(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
