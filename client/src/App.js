// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Digesters from './pages/Digesters';
import Nodes from './pages/Nodes';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

import './styles/global.css';


function App() {
  return (
    <Router>
      <Header />
      <Sidebar />
      <div className="content">
        <Routes>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route path="/" element={<Overview />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/digesters" element={<Digesters />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
