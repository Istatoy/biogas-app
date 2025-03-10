// client/src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul className="menu-list">
          <li>
            <NavLink to="/" activeclassname="active">Overview</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" activeclassname="active">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/customers" activeclassname="active">Customers</NavLink>
          </li>
          <li>
            <NavLink to="/digesters" activeclassname="active">Digesters</NavLink>
          </li>
          <li>
            <NavLink to="/nodes" activeclassname="active">Nodes</NavLink>
          </li>
          <li>
            <NavLink to="/reports" activeclassname="active">Reports</NavLink>
          </li>
          <li>
            <NavLink to="/profile" activeclassname="active">My Profile</NavLink>
          </li>
        </ul>
      </nav>
      <div className="logout-section">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}

export default Sidebar;
