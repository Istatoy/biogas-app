// client/src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import TableChartIcon from '@mui/icons-material/TableChart';
import ReportIcon from '@mui/icons-material/Report';
import PersonIcon from '@mui/icons-material/Person';

function Sidebar() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '60px',
        left: 0,
        width: '180px',
        height: 'calc(100% - 60px)',
        backgroundColor: '#fff',
        borderRight: '1px solid #e0e0e0',
        overflowY: 'auto',
        p: 2
      }}
    >
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ marginBottom: '15px' }}>
          <NavLink to="/" style={{ textDecoration: 'none', color: '#333' }}>
            <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Overview
          </NavLink>
        </li>
        <li style={{ marginBottom: '15px' }}>
          <NavLink to="/dashboard" style={{ textDecoration: 'none', color: '#333' }}>
            <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Dashboard
          </NavLink>
        </li>
        <li style={{ marginBottom: '15px' }}>
          <NavLink to="/customers" style={{ textDecoration: 'none', color: '#333' }}>
            <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Customers
          </NavLink>
        </li>
        <li style={{ marginBottom: '15px' }}>
          <NavLink to="/digesters" style={{ textDecoration: 'none', color: '#333' }}>
            <DeviceHubIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Digesters
          </NavLink>
        </li>
        <li style={{ marginBottom: '15px' }}>
          <NavLink to="/nodes" style={{ textDecoration: 'none', color: '#333' }}>
            <TableChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Nodes
          </NavLink>
        </li>
        <li style={{ marginBottom: '15px' }}>
          <NavLink to="/reports" style={{ textDecoration: 'none', color: '#333' }}>
            <ReportIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Reports
          </NavLink>
        </li>
        <li style={{ marginBottom: '15px' }}>
          <NavLink to="/profile" style={{ textDecoration: 'none', color: '#333' }}>
            <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            My Profile
          </NavLink>
        </li>
      </ul>
    </Box>
  );
}

export default Sidebar;
