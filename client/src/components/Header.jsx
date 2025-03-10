// client/src/components/Header.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/header.css';

function Header() {
  const location = useLocation();

  // Названия страниц по URL
  const pageTitles = {
    '/': 'Overview',
    '/customers': 'Customers',
    '/digesters': 'Digesters',
    '/nodes': 'Nodes',
    '/reports': 'Reports',
    '/profile': 'My Profile',
    '/login': 'Login'
  };

  const currentTitle = pageTitles[location.pathname] || '';

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">Smartbiogas</Link>
        {currentTitle && <span className="page-title">{currentTitle}</span>}
      </div>
      {/* 
        Удаляем всё, кроме логотипа и названия страницы. 
        Если нужно что-то справа (напр. иконки), можно оставить.
      */}
    </header>
  );
}

export default Header;

