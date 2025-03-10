// client/src/components/CustomersTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';

function CustomersTable() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('/api/customers')
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err));
  }, []);

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'External ID', key: 'external_id' },
    { label: 'First Name', key: 'first_name' },
    { label: 'Last Name', key: 'last_name' },
    { label: 'Email', key: 'email' },
    // ...
  ];

  return (
    <div>
      <h3>Customers</h3>
      <CSVLink data={customers} headers={headers} filename="customers.csv">
        Download Data
      </CSVLink>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>External ID</th>
            <th>Name</th>
            <th>Email</th>
            {/* ... */}
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.external_id}</td>
              <td>{c.first_name} {c.last_name}</td>
              <td>{c.email}</td>
              {/* ... */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomersTable;
