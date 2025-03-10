// client/src/pages/Nodes.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/table.css';

function Nodes() {
  const [nodes, setNodes] = useState([]);
  const [formData, setFormData] = useState({
    external_id: '',
    installation_date: '',
    digester_id: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      const res = await axios.get('/api/nodes');
      setNodes(res.data);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/nodes/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('/api/nodes', formData);
      }
      setFormData({ external_id: '', installation_date: '', digester_id: '' });
      fetchNodes();
    } catch (error) {
      console.error('Error saving node:', error);
    }
  };

  const handleEdit = (node) => {
    setEditingId(node.id);
    setFormData({
      external_id: node.external_id || '',
      installation_date: node.installation_date || '',
      digester_id: node.digester_id || ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/nodes/${id}`);
      fetchNodes();
    } catch (error) {
      console.error('Error deleting node:', error);
    }
  };

  // Пагинация
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentNodes = nodes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(nodes.length / pageSize);

  return (
    <div className="page-container">
      <h2>Nodes</h2>
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
          type="date"
          name="installation_date"
          placeholder="Installation Date"
          value={formData.installation_date}
          onChange={handleChange}
        />
        <input
          type="number"
          name="digester_id"
          placeholder="Digester ID"
          value={formData.digester_id}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>External ID</th>
            <th>Installation Date</th>
            <th>Digester ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentNodes.map(n => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>{n.external_id}</td>
              <td>{n.installation_date}</td>
              <td>{n.digester_id}</td>
              <td>
                <button onClick={() => handleEdit(n)}>Edit</button>
                <button onClick={() => handleDelete(n.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={page===currentPage ? 'active' : ''}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Nodes;
