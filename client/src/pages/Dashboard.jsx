// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CountUp from 'react-countup';
import '../styles/dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    customersCount: 0,
    digestersCount: 0,
    nodesCount: 0,
    activeDigesters: 0
  });

  useEffect(() => {
    axios.get('/api/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page-container">
      <h2>Dashboard</h2>
      <div className="cards-container">
        <div className="card">
          <h3>Customers</h3>
          <CountUp end={stats.customersCount} duration={2} />
        </div>
        <div className="card">
          <h3>Digesters</h3>
          <CountUp end={stats.digestersCount} duration={2} />
        </div>
        <div className="card">
          <h3>Nodes</h3>
          <CountUp end={stats.nodesCount} duration={2} />
        </div>
        <div className="card">
          <h3>Active Digesters</h3>
          <CountUp end={stats.activeDigesters} duration={2} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
