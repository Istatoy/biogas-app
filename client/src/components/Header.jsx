// client/src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#2a9d8f',
        boxShadow: 3,
        height: '60px',
        justifyContent: 'center'
      }}
    >
      <Toolbar>
        {/* Логотип (ширина 180px) */}
        <Box sx={{ width: 180 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              sx={{ color: 'white', fontWeight: 700 }}
            >
              Smartbiogas
            </Typography>
          </Link>
        </Box>

        {/* Пустое пространство, если нужно что-то добавить справа */}
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
