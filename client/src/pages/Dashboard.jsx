// client/src/pages/Dashboard.jsx
import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import TableChartIcon from '@mui/icons-material/TableChart';
import ReportIcon from '@mui/icons-material/Report';


function Dashboard() {
  // Пример статических чисел, в реальном случае можно подгружать с сервера
  const stats = {
    customers: 1234,
    devices: 456,
    reports: 78,
    other: 999
  };

  return (
    <Box sx={{ mt: 10, ml: { xs: 0, sm: '220px' }, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        {/* Customers */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <PeopleIcon sx={{ fontSize: '2rem', color: '#2a9d8f' }} />
            <Typography variant="h6" sx={{ mt: 1 }}>
              Customers
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {stats.customers}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Active / Inactive, etc.
            </Typography>
          </Paper>
        </Grid>

        {/* Devices */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <DeviceHubIcon sx={{ fontSize: '2rem', color: '#2a9d8f' }} />
            <Typography variant="h6" sx={{ mt: 1 }}>
              Devices
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {stats.devices}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Some note
            </Typography>
          </Paper>
        </Grid>

        {/* Reports */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <ReportIcon sx={{ fontSize: '2rem', color: '#2a9d8f' }} />
            <Typography variant="h6" sx={{ mt: 1 }}>
              Reports
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {stats.reports}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Some note
            </Typography>
          </Paper>
        </Grid>

        {/* Other (пример) */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <TableChartIcon sx={{ fontSize: '2rem', color: '#2a9d8f' }} />
            <Typography variant="h6" sx={{ mt: 1 }}>
              Other
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {stats.other}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Some note
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
